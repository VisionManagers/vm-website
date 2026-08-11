import type { VercelRequest, VercelResponse } from '@vercel/node';
import Anthropic from '@anthropic-ai/sdk';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { waitUntil } from '@vercel/functions';
import {
  LabLead, GeneratorTool, GENERATOR_TOOLS, GenerateInput,
  scoutSystemPrompt, generatePrompt, followupSystemPrompt, intakeSystemPrompt,
  researchProfilePrompt, memoryUpdatePrompt, reviewPrompt,
} from './_lib/prompts.js';
import { sendVisitSummary } from './_lib/visit-summary.js';

/* Button labels the intake prompt references, matching the UI */
const BUILD_LABELS: Record<GeneratorTool, string> = {
  deals: 'Find my hidden revenue',
  coach: 'Coach me',
  marketing: 'Build my strategy',
  leads: 'Build my lead playbook',
};

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NOTIFY_EMAIL = 'sukhneet@visionmanagers.com';

const MODEL = 'claude-opus-5';
const MEMORY_MODEL = 'claude-haiku-4-5';

// Per-lead daily cap (the real limiter — survives cold starts via Supabase)
const DAILY_CAP = 25;

// IP rate limit stays as a backstop against email-cycling (resets on cold start)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 60;
const RATE_WINDOW_MS = 60 * 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

// Free-mail domains that don't identify a business website
const FREE_MAIL = new Set([
  'gmail.com', 'googlemail.com', 'yahoo.com', 'ymail.com', 'outlook.com', 'hotmail.com',
  'live.com', 'msn.com', 'icloud.com', 'me.com', 'mac.com', 'aol.com', 'protonmail.com',
  'proton.me', 'pm.me', 'mail.com', 'gmx.com', 'gmx.net', 'zoho.com', 'fastmail.com',
  'hey.com', 'yandex.com', 'comcast.net', 'att.net', 'verizon.net', 'sbcglobal.net',
]);

/* "riverside-dental.com" → "Riverside Dental" */
function businessNameFromDomain(domain: string): string {
  const base = domain.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0].split('.')[0];
  return base
    .split(/[-_.]/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function todayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

/* Daily cap + visit tracking, per lead in Supabase. Degrades gracefully
   until migrations 006/007 add the columns. A gap of 30+ minutes since the
   last activity marks the start of a new visit. */
const VISIT_GAP_MS = 30 * 60 * 1000;

async function consumeRun(
  supabase: SupabaseClient,
  lead: Record<string, unknown>
): Promise<{ status: 'ok' | 'capped'; newVisit: boolean }> {
  if (!('daily_runs' in lead)) return { status: 'ok', newVisit: false };
  const today = todayUTC();
  const used = lead.runs_date === today ? Number(lead.daily_runs) || 0 : 0;
  if (used >= DAILY_CAP) return { status: 'capped', newVisit: false };

  const updates: Record<string, unknown> = { daily_runs: used + 1, runs_date: today };
  let newVisit = false;
  if ('last_activity_at' in lead) {
    const last = lead.last_activity_at ? new Date(lead.last_activity_at as string).getTime() : 0;
    newVisit = Date.now() - last > VISIT_GAP_MS;
    updates.last_activity_at = new Date().toISOString();
  }
  const { error } = await supabase.from('lab_leads').update(updates).eq('id', lead.id as string);
  if (error) console.error('Run counter update failed:', error);
  return { status: 'ok', newVisit };
}

function capResponse(res: VercelResponse) {
  return res.status(429).json({
    capReached: true,
    error: "You've used today's bench time — it resets tomorrow. Or skip the wait: book a 20-minute call and see these tools uncapped, wired into your real phone line and calendar.",
  });
}

async function callClaude(
  anthropic: Anthropic,
  args: {
    system: string;
    messages: Anthropic.Beta.BetaMessageParam[];
    maxTokens: number;
    effort: 'low' | 'medium' | 'high';
    tools?: Anthropic.Beta.BetaToolUnion[];
  }
): Promise<string> {
  const messages = [...args.messages];
  const request = () => anthropic.beta.messages.create({
    model: MODEL,
    max_tokens: args.maxTokens,
    system: args.system,
    messages,
    ...(args.tools ? { tools: args.tools } : {}),
    output_config: { effort: args.effort },
    // Server-side fallback: if safety classifiers decline, retry on the recommended model
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
  });

  let response = await request();

  // Server-side tools (web search) can pause mid-turn; resume up to four times
  let continuations = 0;
  while (response.stop_reason === 'pause_turn' && continuations < 4) {
    messages.push({ role: 'assistant', content: response.content });
    response = await request();
    continuations++;
  }

  if (response.stop_reason === 'refusal') {
    return "I can't help with that one — let's keep it focused on your business. Try another question.";
  }

  return response.content
    .filter((block): block is Anthropic.Beta.BetaTextBlock => block.type === 'text')
    .map((block) => block.text)
    .join('\n')
    .trim();
}

/* ── Background jobs (run via waitUntil after the response is sent) ── */

async function researchProfile(supabase: SupabaseClient, anthropic: Anthropic, lead: LabLead): Promise<void> {
  try {
    const { system, user } = researchProfilePrompt(lead);
    const text = await callClaude(anthropic, {
      system,
      messages: [{ role: 'user', content: user }],
      maxTokens: 4000,
      effort: 'medium',
      tools: [{ type: 'web_search_20260209', name: 'web_search', max_uses: 4 }],
    });
    if (!text) return;
    const merged = lead.memory?.trim() ? `${text}\n\n${lead.memory.trim()}` : text;
    const { error } = await supabase
      .from('lab_leads')
      .update({ memory: merged, memory_updated_at: new Date().toISOString() })
      .eq('id', lead.id);
    if (error) console.error('Profile write failed:', error);
  } catch (err) {
    console.error('Profile research failed:', err);
  }
}

async function updateMemory(
  supabase: SupabaseClient,
  anthropic: Anthropic,
  lead: LabLead,
  interaction: string
): Promise<void> {
  try {
    // Re-read memory so parallel tool runs don't clobber each other's updates
    const { data: fresh } = await supabase
      .from('lab_leads').select('memory').eq('id', lead.id).single();
    const current = (fresh?.memory as string | undefined) ?? lead.memory ?? null;

    const { system, user } = memoryUpdatePrompt(current, interaction);
    const resp = await anthropic.messages.create({
      model: MEMORY_MODEL,
      max_tokens: 1500,
      system,
      messages: [{ role: 'user', content: user }],
    });
    const text = resp.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
      .trim();
    if (!text) return;
    const { error } = await supabase
      .from('lab_leads')
      .update({ memory: text, memory_updated_at: new Date().toISOString() })
      .eq('id', lead.id);
    if (error) console.error('Memory write failed:', error);
  } catch (err) {
    console.error('Memory update failed:', err);
  }
}

function memoryIsTracked(lead: Record<string, unknown>): boolean {
  return 'memory' in lead;
}

/* The full generator pipeline, run after the response is sent: draft →
   editor pass → write output to the run row → notify Suk → update memory.
   Failures write an ERROR:: marker the poll endpoint translates. */
async function runGeneration(
  supabase: SupabaseClient,
  anthropic: Anthropic,
  lead: LabLead,
  leadRow: Record<string, unknown>,
  tool: GeneratorTool,
  input: GenerateInput,
  runId: string
): Promise<void> {
  try {
    const prompt = generatePrompt(tool, lead, input);
    // 24k max_tokens: high-effort thinking shares the budget with the visible
    // output, and a truncated deliverable loses its payoff sections.
    const t0 = Date.now();
    const draft = await callClaude(anthropic, {
      system: prompt.system,
      messages: [{ role: 'user', content: prompt.user }],
      maxTokens: 24000,
      effort: 'high',
      tools: [{ type: 'web_search_20260209', name: 'web_search', max_uses: 5 }],
    });

    // Editor pass: repairs mechanical defects without touching the analysis.
    // Low effort — a checklist edit — and skipped if the draft already ate
    // most of the 300s function budget.
    let output = draft;
    if (Date.now() - t0 < 180_000) {
      try {
        const review = reviewPrompt(prompt.user, draft);
        const edited = await callClaude(anthropic, {
          system: review.system,
          messages: [{ role: 'user', content: review.user }],
          maxTokens: 20000,
          effort: 'low',
        });
        // Sanity: an editor that returns a stub or balloons the doc is wrong
        if (edited.length > draft.length * 0.6 && edited.length < draft.length * 1.4) {
          output = edited;
        }
      } catch (err) {
        console.error('Editor pass failed, shipping draft:', err);
      }
    }

    if (!output.trim()) {
      throw new Error('Empty generation');
    }

    await supabase.from('lab_runs').update({ output }).eq('id', runId);

    // Per-run emails retired — the consolidated visit summary carries
    // everything when the visit ends (beacon, idle sweep, or report send)
    const inputNote = [input.question, input.details, input.braindump].filter(Boolean).join(' | ');
    if (memoryIsTracked(leadRow)) {
      await updateMemory(supabase, anthropic, lead,
        `[${tool} tool run]\n${inputNote ? `Owner input: ${inputNote.slice(0, 1200)}\n` : ''}Delivered: ${output.slice(0, 3500)}`);
    }
  } catch (err) {
    console.error(`Generation ${runId} failed:`, err);
    await supabase.from('lab_runs')
      .update({ output: 'ERROR:: The generation hit a snag. Run it again — your inputs are saved.' })
      .eq('id', runId)
      .then(({ error }) => { if (error) console.error('Error-marker write failed:', error); });
  }
}

/* ── Lead-activity notifications to Suk ── */

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function leadHeader(lead: LabLead): string {
  return `<p><strong>${escapeHtml(lead.name || 'Unknown')}</strong> · ${escapeHtml(lead.email)}${lead.city ? ` · ${escapeHtml(lead.city)}` : ''}<br/>
    <strong>${escapeHtml(lead.business_name)}</strong>${lead.website ? ` · ${escapeHtml(lead.website)}` : ''}</p>`;
}

async function notifySuk(subject: string, html: string): Promise<void> {
  if (!RESEND_API_KEY) return;
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Vision Managers <notifications@visionmanagers.com>',
        to: NOTIFY_EMAIL,
        subject,
        html,
      }),
    });
  } catch (err) {
    console.error('Activity notification failed:', err);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // navigator.sendBeacon delivers text/plain bodies; normalize to JSON
  if (typeof req.body === 'string') {
    try { (req as { body: unknown }).body = JSON.parse(req.body); } catch { /* leave as-is */ }
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return res.status(500).json({ error: 'Server configuration error' });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'AI service not configured' });
  }

  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 'unknown';
  // Polling and visit-close beacons are cheap and frequent — they must not
  // consume the IP budget or a single generation would trip the backstop.
  if (!['poll', 'end-visit'].includes(req.body?.action) && isRateLimited(ip)) {
    return res.status(429).json({ error: 'The lab is popular today — please come back in an hour.' });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  // Explicit timeout, sized under the 300s function cap. Without it the SDK
  // throws "Streaming is required for operations that may take longer than 10
  // minutes" client-side for large max_tokens — instantly failing every
  // generator run (evals never hit this: the harness sets its own timeout).
  const anthropic = new Anthropic({ timeout: 280_000 });
  const { action } = req.body || {};

  try {
    // ── Start a session: name + email required; returning visitors are recognized by email ──
    if (action === 'start') {
      const { name, email, website, phone } = req.body;

      if (!name || typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({ error: 'Your name is required.' });
      }
      if (!email || typeof email !== 'string' || !email.includes('@')) {
        return res.status(400).json({ error: 'A valid email is required.' });
      }

      // Website: what they typed, or derived from a business email domain
      let site = typeof website === 'string' ? website.trim() : '';
      const emailDomain = email.split('@')[1]?.toLowerCase().trim();
      if (!site && emailDomain && !FREE_MAIL.has(emailDomain)) {
        site = emailDomain;
      }

      // Returning visitor? Match on email, most recent lead wins.
      const { data: existing } = await supabase
        .from('lab_leads')
        .select('*')
        .eq('email', email)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      let lead: Record<string, unknown> | null = null;
      let returning = false;

      if (existing) {
        returning = true;
        const updates: Record<string, string> = { name: name.trim() };
        if (site && site !== existing.website) {
          updates.website = site;
          updates.business_name = businessNameFromDomain(site);
        }
        if (typeof phone === 'string' && phone.trim()) updates.phone = phone.trim();
        const { data: updated, error } = await supabase
          .from('lab_leads').update(updates).eq('id', existing.id).select('*').single();
        if (error && /phone/.test(error.message)) {
          delete updates.phone;
          const retry = await supabase
            .from('lab_leads').update(updates).eq('id', existing.id).select('*').single();
          lead = retry.data;
        } else {
          lead = updated ?? existing;
        }
      } else {
        const businessName = site ? businessNameFromDomain(site) : `${name.trim().split(/\s+/)[0]}'s business`;
        const row: Record<string, string | null> = {
          name: name.trim(),
          email,
          business_name: businessName,
          website: site || null,
          phone: (typeof phone === 'string' && phone.trim()) || null,
        };
        let { data, error } = await supabase.from('lab_leads').insert(row).select('*').single();
        if (error && /phone/.test(error.message)) {
          delete row.phone;
          ({ data, error } = await supabase.from('lab_leads').insert(row).select('*').single());
        }
        if (error || !data) {
          console.error('Supabase insert error:', error);
          return res.status(500).json({ error: 'Failed to start session.' });
        }
        lead = data;
      }

      if (!lead) {
        return res.status(500).json({ error: 'Failed to start session.' });
      }

      // Background: research the business once, so the tools already know it
      if (memoryIsTracked(lead) && !(lead.memory as string | null)?.trim()) {
        waitUntil(researchProfile(supabase, anthropic, lead as unknown as LabLead));
      }

      // Notify Suk of the visit (non-blocking)
      if (RESEND_API_KEY) {
        waitUntil(fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Vision Managers <notifications@visionmanagers.com>',
            to: NOTIFY_EMAIL,
            subject: `Lab visitor${returning ? ' (returning)' : ''}: ${lead.business_name}`,
            html: `<p><strong>${name}</strong> (${email}) just ${returning ? 're-entered' : 'entered'} The Workbench.</p>
              <p>Business: ${lead.business_name}<br/>
              ${lead.website ? `Website: ${lead.website}<br/>` : ''}
              ${lead.phone ? `Phone: ${lead.phone}` : ''}</p>`,
          }),
        }).catch((err) => console.error('Lead notification failed:', err)));
      }

      return res.status(200).json({
        leadId: lead.id,
        businessName: lead.business_name,
        returning,
      });
    }

    // ── All other actions need an existing lead ──
    const { leadId } = req.body;
    if (!leadId || typeof leadId !== 'string') {
      return res.status(400).json({ error: 'Missing session. Fill in your business first.' });
    }

    const { data: leadRow, error: leadError } = await supabase
      .from('lab_leads')
      .select('*')
      .eq('id', leadId)
      .single();

    if (leadError || !leadRow) {
      return res.status(404).json({ error: 'Session not found. Please start again.' });
    }
    const lead = leadRow as unknown as LabLead;

    // ── Conversational: the Deal Scout, and follow-up chat under each generator ──
    if (action === 'chat') {
      const { messages, tool: chatTool = 'scout' } = req.body as {
        messages: { role: 'user' | 'assistant'; content: string }[];
        tool?: string;
      };
      const isScout = chatTool === 'scout';
      const isFollowup = GENERATOR_TOOLS.includes(chatTool as GeneratorTool);
      if (!isScout && !isFollowup) {
        return res.status(400).json({ error: 'Unknown agent.' });
      }
      if (!Array.isArray(messages) || messages.length === 0 || messages.length > 60) {
        return res.status(400).json({ error: 'Invalid conversation.' });
      }
      const clean = messages
        .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
        .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));

      // Seeded assistant greetings are client-side; the API requires the
      // first message to be from the user, so drop leading assistant turns.
      while (clean.length && clean[0].role === 'assistant') clean.shift();
      if (clean.length === 0) {
        return res.status(400).json({ error: 'Invalid conversation.' });
      }

      {
        const { status, newVisit } = await consumeRun(supabase, leadRow);
        if (status === 'capped') return capResponse(res);
        if (newVisit) {
          waitUntil(notifySuk(
            `On the bench now: ${lead.business_name}`,
            `${leadHeader(lead)}<p>A new visit just started — the full summary lands when they leave.</p>`
          ));
        }
      }

      let system: string;
      if (isScout) {
        system = scoutSystemPrompt(lead);
      } else {
        // Before the first build this chat is the intake conversation —
        // gathering the owner's real numbers instead of inferring them.
        // After a build it grounds follow-ups in the latest deliverable.
        const { data: lastRun } = await supabase
          .from('lab_runs')
          .select('output')
          .eq('lead_id', leadId)
          .eq('tool', chatTool)
          .neq('output', '')
          .not('output', 'like', 'ERROR::%')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        system = lastRun?.output
          ? followupSystemPrompt(chatTool as GeneratorTool, lead, lastRun.output)
          : intakeSystemPrompt(chatTool as GeneratorTool, lead, BUILD_LABELS[chatTool as GeneratorTool]);
      }

      // Scout: medium effort but a tight search budget — the prompt has it work
      // in small batches so "keep hunting" spans turns instead of one long turn
      // that would blow the function timeout.
      const reply = await callClaude(anthropic, {
        system,
        messages: clean,
        maxTokens: isScout ? 8000 : 4000,
        effort: 'medium',
        tools: [{ type: 'web_search_20260209', name: 'web_search', max_uses: isScout ? 5 : 2 }],
      });

      // Keep one transcript row per lead per agent, updated as the conversation grows
      const transcript = [...clean, { role: 'assistant' as const, content: reply }];
      const storeKey = isScout ? 'scout' : `${chatTool}-chat`;
      const { data: existing } = await supabase
        .from('lab_runs')
        .select('id')
        .eq('lead_id', leadId)
        .eq('tool', storeKey)
        .limit(1)
        .maybeSingle();

      if (existing) {
        await supabase.from('lab_runs').update({ input: transcript, output: reply }).eq('id', existing.id);
      } else {
        await supabase.from('lab_runs').insert({ lead_id: leadId, tool: storeKey, input: transcript, output: reply });
      }

      if (memoryIsTracked(leadRow)) {
        const lastUser = [...clean].reverse().find((m) => m.role === 'user')?.content ?? '';
        waitUntil(updateMemory(supabase, anthropic, lead,
          `[${storeKey} chat]\nOwner said: ${lastUser.slice(0, 1500)}\nAdvisor replied: ${reply.slice(0, 2500)}`));
      }

      return res.status(200).json({ reply });
    }

    // ── One-shot generators: deals, coach, marketing, leads ──
    // Async job pattern: browsers kill multi-minute synchronous responses, so
    // generate returns a runId instantly, the work continues via waitUntil
    // writing into the lab_runs row, and the client polls for the result.
    if (action === 'generate') {
      const { tool, input = {} } = req.body as { tool: string; input?: GenerateInput };
      if (!GENERATOR_TOOLS.includes(tool as GeneratorTool)) {
        return res.status(400).json({ error: 'Unknown tool.' });
      }
      // The intake conversation rides along as ground truth for the build
      if (input.transcript) {
        if (!Array.isArray(input.transcript)) {
          delete input.transcript;
        } else {
          input.transcript = input.transcript
            .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
            .slice(-30)
            .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));
        }
      }

      {
        const { status, newVisit } = await consumeRun(supabase, leadRow);
        if (status === 'capped') return capResponse(res);
        if (newVisit) {
          waitUntil(notifySuk(
            `On the bench now: ${lead.business_name}`,
            `${leadHeader(lead)}<p>A new visit just started — the full summary lands when they leave.</p>`
          ));
        }
      }

      // Pending marker: empty output. 'ERROR::' prefix marks a failed run.
      const { data: runRow, error: runErr } = await supabase
        .from('lab_runs')
        .insert({ lead_id: leadId, tool, input, output: '' })
        .select('id')
        .single();
      if (runErr || !runRow) {
        console.error('Run insert failed:', runErr);
        return res.status(500).json({ error: 'Could not start the run. Try again.' });
      }

      waitUntil(runGeneration(supabase, anthropic, lead, leadRow, tool as GeneratorTool, input, runRow.id));

      return res.status(202).json({ runId: runRow.id });
    }

    // ── Poll an in-flight generator run ──
    if (action === 'poll') {
      const { runId } = req.body as { runId?: string };
      if (!runId || typeof runId !== 'string') {
        return res.status(400).json({ error: 'Missing run.' });
      }
      const { data: run } = await supabase
        .from('lab_runs')
        .select('output')
        .eq('id', runId)
        .eq('lead_id', leadId)
        .maybeSingle();
      if (!run) return res.status(404).json({ error: 'Run not found.' });
      const out = (run.output as string) || '';
      if (!out) return res.status(200).json({ status: 'pending' });
      if (out.startsWith('ERROR::')) {
        return res.status(200).json({ status: 'error', error: out.slice(7).trim() || 'Generation failed. Try again.' });
      }
      return res.status(200).json({ status: 'done', output: out });
    }

    // ── Visit ended (browser beacon on page close) — send the consolidated summary ──
    if (action === 'end-visit') {
      if (RESEND_API_KEY && 'visit_notified_at' in leadRow && leadRow.last_activity_at) {
        const lastActivity = new Date(leadRow.last_activity_at as string).getTime();
        const notified = leadRow.visit_notified_at ? new Date(leadRow.visit_notified_at as string).getTime() : 0;
        if (lastActivity > notified) {
          const key = RESEND_API_KEY;
          waitUntil((async () => {
            const since = new Date(Date.now() - 12 * 3600 * 1000).toISOString();
            const sent = await sendVisitSummary(supabase, key, leadRow, since);
            if (sent) {
              await supabase.from('lab_leads')
                .update({ visit_notified_at: new Date().toISOString() })
                .eq('id', leadId);
            }
          })().catch((err) => console.error('Visit summary failed:', err)));
        }
      }
      return res.status(200).json({ ok: true });
    }

    return res.status(400).json({ error: 'Unknown action.' });
  } catch (err) {
    console.error('Lab API error:', err);
    return res.status(500).json({ error: 'Something went wrong in the lab. Try again in a moment.' });
  }
}
