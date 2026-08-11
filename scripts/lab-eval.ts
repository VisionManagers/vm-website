/* ────────────────────────────────────────────────────────────────
   Workbench prompt eval harness.

   Runs the SAME prompt module the site uses (api/_lib/prompts.ts)
   against fixed personas, then scores each output with a separate
   Claude judge on five dimensions (1-10):
     specificity · actionability · credibility · voice · transformation

   Ship criterion per tool: avg ≥ 8.5 AND no dimension < 7.5,
   sustained across two consecutive iterations, max 5 iterations.

   Usage:
     export ANTHROPIC_API_KEY=...   (or source the pulled Vercel env)
     npx tsx scripts/lab-eval.ts                # all tools
     npx tsx scripts/lab-eval.ts --tool deals   # one tool
     npx tsx scripts/lab-eval.ts --label iter2  # tag the output dir
   ──────────────────────────────────────────────────────────────── */

import fs from 'node:fs';
import path from 'node:path';
import Anthropic from '@anthropic-ai/sdk';
import {
  LabLead, GeneratorTool, GenerateInput,
  scoutSystemPrompt, generatePrompt,
} from '../api/_lib/prompts';

const MODEL = 'claude-opus-5';

const anthropic = new Anthropic({ timeout: 15 * 60 * 1000, maxRetries: 3 });

/* ── Personas (no websites — memory simulates the profile research,
      which also exercises the memory-injection path) ── */

const DENTIST: LabLead = {
  id: 'eval-dentist', name: 'Maya Chen', email: 'eval@example.com',
  business_name: 'Chen Family Dental', industry: 'dental practice', city: 'Renton, WA',
  website: null, goal: 'Fill the ~30% of hygiene slots sitting empty each week',
  memory: `## Business profile
- General/family dentistry, 2 doctors, 3 hygienists, 5 operatories (from intake conversation)
- ~1,900 active patients; open Mon-Thu 7-5, Fri 7-1
- Google: 4.6 stars, 41 reviews; last review 3 months ago
- Website is dated; no online booking; front desk of 2 handles phones
## Goals & pain points
- Hygiene schedule runs ~70% full; cancellations often unfilled same-day
- Suspects missed calls during lunch hour; no after-hours answering
## Context for next time
- Maya is analytical, wants numbers not pep talks`,
};

const HVAC: LabLead = {
  id: 'eval-hvac', name: 'Sam Torres', email: 'eval@example.com',
  business_name: 'Torres Heating & Air', industry: 'HVAC (residential heating & cooling)', city: 'Spokane, WA',
  website: null, goal: 'Smooth out the spring/fall slump and stop living install-to-install',
  memory: `## Business profile
- Residential HVAC: repair, maintenance, replacements. Sam + 3 techs + 1 office manager
- ~$1.4M revenue; installs ~60% of revenue, service ~40%
- Google: 4.8 stars, 112 reviews; strong summer/winter, dead shoulders
- 310 past customers on a spreadsheet; no maintenance-plan program
## Goals & pain points
- Shoulder seasons drop to ~50% capacity; best tech just gave notice
- Sam still runs calls himself 2-3 days/week
## Context for next time
- Sam is blunt, hates fluff, will actually execute scripts if given them`,
};

const ATTORNEY: LabLead = {
  id: 'eval-attorney', name: 'Priya Nair', email: 'eval@example.com',
  business_name: 'Nair Family Law', industry: 'family law (divorce, custody, mediation)', city: 'Bellevue, WA',
  website: null, goal: 'More consultations without buying ads',
  memory: `## Business profile
- Solo family-law attorney + 1 paralegal; 9 years practicing; mediation-forward positioning
- Avg case value ~$8,500; capacity for ~6 new clients/month, currently signing ~3
- Google: 5.0 stars but only 14 reviews; Avvo profile unclaimed
- Referrals from 2 therapists and 1 financial planner produce most clients
## Goals & pain points
- Consult pipeline is feast-or-famine; website inquiries go to email she checks twice a day
- Dislikes self-promotion; will not do TikTok
## Context for next time
- Priya is warm but time-poor; wants systems that run without her`,
};

/* ── Scenario matrix: 2 scenarios per tool ── */

interface Scenario {
  id: string;
  tool: GeneratorTool | 'scout';
  lead: LabLead;
  input?: GenerateInput;
  messages?: { role: 'user' | 'assistant'; content: string }[];
  note: string; // shown to the judge
}

const SCENARIOS: Scenario[] = [
  {
    id: 'deals-dentist', tool: 'deals', lead: DENTIST, input: {},
    note: 'Revenue Leak Audit for a dental practice with empty hygiene slots.',
  },
  {
    id: 'deals-hvac', tool: 'deals', lead: HVAC,
    input: { braindump: 'Winter was great but April is dead again. I have three trucks and two of them sat idle most of last week. I keep meaning to call past customers but never do.' },
    note: 'Revenue Leak Audit for an HVAC company with seasonal slumps and a dormant customer list.',
  },
  {
    id: 'coach-hvac', tool: 'coach', lead: HVAC,
    input: { question: 'My best tech just gave notice and I\'m back in the trucks half the week. Do I hire two techs, raise prices, or both? I can\'t tell if I have a people problem or a pricing problem.' },
    note: 'Decision-shaped coaching question: hire vs price, with the owner back on the tools.',
  },
  {
    id: 'coach-attorney', tool: 'coach', lead: ATTORNEY,
    input: { question: 'Should I hire an associate attorney or stay solo and raise my rates? I\'m at capacity some months and empty others.' },
    note: 'Decision-shaped coaching question: associate vs rates, with lumpy demand.',
  },
  {
    id: 'marketing-attorney', tool: 'marketing', lead: ATTORNEY,
    input: { assetType: 'full marketing kit', braindump: 'My referrals from the two therapists dried up over the summer. People who call say they found me on Google but most callers are price shoppers who want the cheapest divorce. I do my best work in mediation and collaborative divorce — those clients are happier and pay without drama. I have not emailed my past clients in two years.' },
    note: 'Strategy-first marketing for a solo family lawyer: reposition toward mediation clients, away from price shoppers.',
  },
  {
    id: 'marketing-dentist', tool: 'marketing', lead: DENTIST,
    input: { assetType: 'promo email', braindump: 'Hygiene is 70% booked. We just added Saturday-morning hygiene hours once a month to test. Existing patients only for now.' },
    note: 'Promo email for a dental practice launching Saturday hygiene hours to reactivate existing patients.',
  },
  {
    id: 'leads-hvac', tool: 'leads', lead: HVAC,
    input: { braindump: 'Best customers are homeowners east of town in houses 15+ years old who sign up for replacements, not repairs. Most came from word of mouth or Google.' },
    note: 'Lead-gen playbook for HVAC targeting replacement customers in Spokane.',
  },
  {
    id: 'leads-attorney', tool: 'leads', lead: ATTORNEY, input: {},
    note: 'Lead-gen playbook for a solo family-law attorney who won\'t buy ads; referral-partnership heavy.',
  },
  {
    id: 'scout-interview', tool: 'scout',
    lead: { id: 'eval-inv', name: 'Jordan Ellis', email: 'eval@example.com', business_name: "Jordan's business", industry: null, city: 'Boise, ID', website: null, goal: null },
    messages: [{ role: 'user', content: 'I want to find my first rental property but honestly I don\'t know where to start.' }],
    note: 'First-touch interview: a beginner investor. Judge the quality of the interview move — one question, calibrated to a beginner, momentum-building.',
  },
  {
    id: 'scout-hunt', tool: 'scout',
    lead: { id: 'eval-inv', name: 'Jordan Ellis', email: 'eval@example.com', business_name: "Jordan's business", industry: null, city: 'Boise, ID', website: null, goal: null },
    messages: [{ role: 'user', content: 'Pierce County WA. Single-family homes, max $450k. I care about pre-foreclosure and tax-delinquent. Exit is a flip, I want 20% margin minimum. Go hunt.' }],
    note: 'Full buy-box handed over in one message; the scout should hunt with real searches and cite honestly.',
  },
];

/* ── Run a scenario through the live model with the site's exact parameters ── */

async function callModel(args: {
  system: string;
  messages: { role: 'user' | 'assistant'; content: string }[];
  maxTokens: number;
  effort: 'low' | 'medium' | 'high';
  maxSearches: number;
}): Promise<string> {
  const messages: Anthropic.Beta.BetaMessageParam[] = [...args.messages];
  const request = () => anthropic.beta.messages.create({
    model: MODEL,
    max_tokens: args.maxTokens,
    system: args.system,
    messages,
    tools: [{ type: 'web_search_20260209', name: 'web_search', max_uses: args.maxSearches }],
    output_config: { effort: args.effort },
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
  });

  let response = await request();
  let continuations = 0;
  while (response.stop_reason === 'pause_turn' && continuations < 4) {
    messages.push({ role: 'assistant', content: response.content });
    response = await request();
    continuations++;
  }

  return response.content
    .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('\n')
    .trim();
}

async function runScenario(s: Scenario): Promise<string> {
  if (s.tool === 'scout') {
    return callModel({
      system: scoutSystemPrompt(s.lead),
      messages: s.messages!,
      maxTokens: 8000,
      effort: 'medium',
      maxSearches: 3,
    });
  }
  const prompt = generatePrompt(s.tool, s.lead, s.input ?? {});
  return callModel({
    system: prompt.system,
    messages: [{ role: 'user', content: prompt.user }],
    maxTokens: 24000,
    effort: 'high',
    maxSearches: 5,
  });
}

/* ── Judge ── */

const TOOL_INTENT: Record<string, string> = {
  deals: 'A "Revenue Leak Audit": walk the owner\'s customer journey stage by stage, size each leak in dollars with visible math and industry benchmarks, rank the leaks, and say which to attack first. The owner should feel an expert just read their business.',
  coach: 'A coaching session answer: diagnose the real question behind the question, give a direct verdict (not a menu), name the trade-off, say what to ignore, give a 14-day plan with owners and deadlines, and one accountability metric.',
  marketing: 'Strategy-first marketing: diagnose the market, commit to ONE big idea that fits this business, then produce ready-to-ship materials that all carry that idea. The owner should walk away with a strategy they own, not just copy.',
  leads: 'A lead-generation playbook: dream-client profiles with lifetime-value math, ranked channels for THIS market (real named venues where possible), first-touch scripts that sound human, a sustainable weekly rhythm under 4 hours, and a scoreboard with kill thresholds.',
  scout: 'A real-estate deal scout: builds a buy-box through sharp one-question turns, hunts with live web search, presents only real cited findings with honest verification caveats, and always ends with a clear next move.',
};

interface JudgeResult {
  specificity: number;
  actionability: number;
  credibility: number;
  voice: number;
  transformation: number;
  notes: string;
  top_fixes: string[];
}

async function judge(s: Scenario, output: string): Promise<JudgeResult> {
  const personaDesc = `${s.lead.name} — ${s.lead.business_name}${s.lead.industry ? ` (${s.lead.industry})` : ''}${s.lead.city ? `, ${s.lead.city}` : ''}. Goal: ${s.lead.goal || 'n/a'}.`;

  const system = `You are the harshest deliverable reviewer at an elite consulting firm, scoring AI-generated business deliverables for a public demo whose entire job is to make small-business owners say "I need this company." You have seen thousands of these; mediocrity bores you and inflated scores get people fired. Score honestly against the anchors — most first drafts land 5-7.

Score five dimensions, integers 1-10:
- specificity: Could this only have been written for THIS business and market? (10 = every section leans on their real facts, numbers, city, and constraints; 5 = right industry but swappable; 2 = generic template)
- actionability: Could the owner start Monday morning? (10 = concrete steps with numbers, scripts, time estimates, and definitions of done; 5 = sensible advice but the owner must figure out the how; 2 = platitudes)
- credibility: Is every number earned? (10 = visible math, labeled assumptions, plausible industry benchmarks, cited sources where claimed, zero invented facts about the business; 5 = mostly reasonable but some figures appear from nowhere; 2 = confident fabrication — automatic if ANY fact about their business is invented)
- voice: Does it read like a $500/hr advisor? (10 = direct, warm, opinionated, zero filler or AI-isms; 5 = competent but flat or padded; 2 = AI content-mill)
- transformation: Would the owner screenshot this, share it, and book a call? (10 = at least one genuine "how did it know that" moment plus a reframe they'd repeat to their spouse; 5 = useful but forgettable; 2 = they'd close the tab)

Also return: notes (3-5 sentences on the biggest gap between this and a 10) and top_fixes (the 3-5 highest-leverage concrete changes to the PROMPT that produced this — prompt fixes, not content edits).`;

  const user = `TOOL INTENT: ${TOOL_INTENT[s.tool]}

PERSONA: ${personaDesc}
SCENARIO: ${s.note}
WHAT THE AI KNEW (memory/profile available to it):
${s.lead.memory || '(none)'}
${s.input ? `OWNER INPUT: ${JSON.stringify(s.input)}` : ''}${s.messages ? `CONVERSATION SO FAR: ${JSON.stringify(s.messages)}` : ''}

DELIVERABLE TO SCORE:
---
${output}
---`;

  const resp = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 3000,
    system,
    messages: [{ role: 'user', content: user }],
    output_config: {
      effort: 'medium',
      format: {
        type: 'json_schema',
        schema: {
          type: 'object',
          additionalProperties: false,
          required: ['specificity', 'actionability', 'credibility', 'voice', 'transformation', 'notes', 'top_fixes'],
          properties: {
            specificity: { type: 'integer' },
            actionability: { type: 'integer' },
            credibility: { type: 'integer' },
            voice: { type: 'integer' },
            transformation: { type: 'integer' },
            notes: { type: 'string' },
            top_fixes: { type: 'array', items: { type: 'string' } },
          },
        },
      },
    },
  } as Anthropic.MessageCreateParamsNonStreaming);

  const text = resp.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text).join('');
  return JSON.parse(text) as JudgeResult;
}

/* ── Main ── */

const DIMS = ['specificity', 'actionability', 'credibility', 'voice', 'transformation'] as const;

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY not set.');
    process.exit(1);
  }
  const argv = process.argv.slice(2);
  const toolArg = argv.includes('--tool') ? argv[argv.indexOf('--tool') + 1] : null;
  const label = argv.includes('--label') ? argv[argv.indexOf('--label') + 1] : `run-${Date.now()}`;
  // --skip-judge: run scenarios only (outputs saved for external judging —
  // e.g. judging inside a Claude Code session on subscription usage)
  const skipJudge = argv.includes('--skip-judge');

  const scenarios = SCENARIOS.filter((s) => !toolArg || s.tool === toolArg);
  if (scenarios.length === 0) {
    console.error(`No scenarios for tool "${toolArg}".`);
    process.exit(1);
  }

  const outDir = path.join(process.env.EVAL_OUT || 'eval-out', label);
  fs.mkdirSync(outDir, { recursive: true });

  console.log(`Running ${scenarios.length} scenarios → ${outDir}\n`);

  const results: { scenario: Scenario; output: string; judge: JudgeResult; avg: number }[] = [];

  // Chunks of 4 to stay friendly to rate limits; transient network errors
  // retry per scenario, and completed scenarios resume from saved JSON.
  const withRetry = async <T>(fn: () => Promise<T>, tries = 3): Promise<T> => {
    let lastErr: unknown;
    for (let attempt = 1; attempt <= tries; attempt++) {
      try { return await fn(); } catch (err) {
        lastErr = err;
        console.log(`    (attempt ${attempt} failed: ${err instanceof Error ? err.message : err} — ${attempt < tries ? 'retrying' : 'giving up'})`);
        if (attempt < tries) await new Promise((r) => setTimeout(r, 15000 * attempt));
      }
    }
    throw lastErr;
  };

  for (let i = 0; i < scenarios.length; i += 4) {
    const chunk = scenarios.slice(i, i + 4);
    const chunkResults = await Promise.all(chunk.map(async (s) => {
      const jsonPath = path.join(outDir, `${s.id}.json`);
      if (fs.existsSync(jsonPath)) {
        const saved = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        console.log(`  ${s.id}: avg ${saved.avg.toFixed(1)} (resumed from earlier run)`);
        return { scenario: s, output: saved.output as string, judge: saved.judge as JudgeResult, avg: saved.avg as number };
      }
      const t0 = Date.now();
      const output = await withRetry(() => runScenario(s));
      if (skipJudge) {
        console.log(`  ${s.id}: output ready, unjudged (${Math.round((Date.now() - t0) / 1000)}s)`);
        fs.writeFileSync(path.join(outDir, `${s.id}.output.md`),
          `# ${s.id} (unjudged)\n\nPERSONA: ${s.lead.name} — ${s.lead.business_name}${s.lead.industry ? ` (${s.lead.industry})` : ''}${s.lead.city ? `, ${s.lead.city}` : ''}. Goal: ${s.lead.goal || 'n/a'}\nSCENARIO: ${s.note}\nMEMORY AVAILABLE:\n${s.lead.memory || '(none)'}\n${s.input ? `OWNER INPUT: ${JSON.stringify(s.input)}` : ''}${s.messages ? `CONVERSATION: ${JSON.stringify(s.messages)}` : ''}\n\n## Output\n\n${output}\n`);
        return null as any;
      }
      const j = await withRetry(() => judge(s, output));
      const avg = DIMS.reduce((sum, d) => sum + j[d], 0) / DIMS.length;
      console.log(`  ${s.id}: avg ${avg.toFixed(1)} [${DIMS.map((d) => j[d]).join(' ')}] (${Math.round((Date.now() - t0) / 1000)}s)`);
      fs.writeFileSync(jsonPath, JSON.stringify({ output, judge: j, avg }, null, 2));
      fs.writeFileSync(path.join(outDir, `${s.id}.md`),
        `# ${s.id} — avg ${avg.toFixed(1)}\n\nScores: ${DIMS.map((d) => `${d} ${j[d]}`).join(' · ')}\n\n## Judge notes\n${j.notes}\n\n## Top fixes\n${j.top_fixes.map((f) => `- ${f}`).join('\n')}\n\n## Output\n\n${output}\n`);
      return { scenario: s, output, judge: j, avg };
    }));
    results.push(...chunkResults.filter(Boolean));
  }

  if (skipJudge) {
    console.log(`\nOutputs written to ${outDir}/*.output.md — judge externally.`);
    return;
  }

  // Per-tool rollup
  const tools = [...new Set(results.map((r) => r.scenario.tool))];
  const summary: Record<string, any> = {};
  console.log('\n── Per-tool rollup ──');
  for (const tool of tools) {
    const rs = results.filter((r) => r.scenario.tool === tool);
    const dimAvgs = Object.fromEntries(DIMS.map((d) => [d,
      rs.reduce((sum, r) => sum + r.judge[d], 0) / rs.length]));
    const avg = Object.values(dimAvgs).reduce((a: number, b: any) => a + b, 0) / DIMS.length;
    const minDim = Math.min(...Object.values(dimAvgs) as number[]);
    const pass = avg >= 8.5 && minDim >= 7.5;
    summary[tool] = { avg: +avg.toFixed(2), dims: dimAvgs, pass };
    console.log(`  ${tool}: avg ${avg.toFixed(2)} min-dim ${minDim.toFixed(1)} → ${pass ? 'PASS' : 'needs work'}`);
  }

  fs.writeFileSync(path.join(outDir, 'summary.json'), JSON.stringify({
    label,
    scenarios: results.map((r) => ({
      id: r.scenario.id, tool: r.scenario.tool, avg: +r.avg.toFixed(2),
      scores: Object.fromEntries(DIMS.map((d) => [d, r.judge[d]])),
      top_fixes: r.judge.top_fixes,
    })),
    perTool: summary,
  }, null, 2));

  console.log(`\nWrote ${outDir}/summary.json`);
}

main().catch((err) => { console.error(err); process.exit(1); });
