import type { SupabaseClient } from '@supabase/supabase-js';

/* One consolidated email per visit — everything the lead did on the bench,
   sent when they leave (browser beacon), idle out (lab-visits cron), or
   email themselves the report (the PDF BCC becomes the summary instead). */

const NOTIFY_EMAIL = 'sukhneet@visionmanagers.com';

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const pre = (s: string) =>
  `<pre style="white-space:pre-wrap;font-family:Georgia,serif;font-size:13px;background:#f8fafc;padding:12px;border-left:3px solid #00C2B2;margin:8px 0;">${escapeHtml(s)}</pre>`;

export async function sendVisitSummary(
  supabase: SupabaseClient,
  resendKey: string,
  lead: Record<string, any>,
  sinceIso: string
): Promise<boolean> {
  const { data: runs } = await supabase
    .from('lab_runs')
    .select('tool, input, output, created_at')
    .eq('lead_id', lead.id)
    .neq('output', '')
    .not('output', 'like', 'ERROR::%')
    .gte('created_at', sinceIso)
    .order('created_at', { ascending: true })
    .limit(15);

  // Chat rows are updated in place, so a conversation continued during this
  // visit can carry an older created_at — pull recent chat rows separately
  const { data: chatRows } = await supabase
    .from('lab_runs')
    .select('tool, input, output, created_at')
    .eq('lead_id', lead.id)
    .like('tool', '%chat')
    .neq('output', '')
    .limit(10);

  const seen = new Set((runs || []).map((r) => `${r.tool}-${r.created_at}`));
  const all = [...(runs || []), ...(chatRows || []).filter((r) => !seen.has(`${r.tool}-${r.created_at}`))];
  const scout = await supabase
    .from('lab_runs').select('tool, input, output, created_at')
    .eq('lead_id', lead.id).eq('tool', 'scout').neq('output', '').maybeSingle();
  if (scout.data && !all.some((r) => r.tool === 'scout')) all.push(scout.data);

  if (all.length === 0) return false;

  const sections = all.map((run) => {
    if (Array.isArray(run.input)) {
      const transcript = (run.input as { role: string; content: string }[])
        .map((m) => `${m.role === 'user' ? '👤 THEM' : '🤖 AI'}: ${m.content}`)
        .join('\n\n');
      return `<h4 style="margin:16px 0 4px;">💬 ${escapeHtml(run.tool)} conversation (${(run.input as unknown[]).length} messages)</h4>${pre(transcript.slice(0, 8000))}`;
    }
    const inputNote = run.input && typeof run.input === 'object'
      ? Object.entries(run.input as Record<string, unknown>)
          .filter(([k, v]) => k !== 'transcript' && typeof v === 'string' && v)
          .map(([, v]) => v as string).join(' | ')
      : '';
    return `<h4 style="margin:16px 0 4px;">🔧 ${escapeHtml(run.tool)}</h4>
      ${inputNote ? `<p style="margin:4px 0;"><em>Input:</em> ${escapeHtml(inputNote.slice(0, 600))}</p>` : ''}
      ${pre((run.output || '').slice(0, 7000))}`;
  }).join('');

  const emailRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'Vision Managers <notifications@visionmanagers.com>',
      to: NOTIFY_EMAIL,
      subject: `Visit summary: ${lead.business_name} — ${all.length} interaction${all.length === 1 ? '' : 's'}`,
      html: `<div style="font-family:Georgia,serif;max-width:680px;margin:0 auto;color:#1e293b;">
        <h1 style="color:#0B4C83;margin-bottom:4px;">${escapeHtml(lead.business_name)} just left the bench</h1>
        <p style="margin:0 0 16px;color:#475569;">${escapeHtml(lead.name || '')} · ${escapeHtml(lead.email)}${lead.phone ? ` · ${escapeHtml(lead.phone)}` : ''}${lead.website ? ` · ${escapeHtml(lead.website)}` : ''}</p>
        ${lead.memory ? `<h4 style="margin:12px 0 4px;">🧠 What the AI now knows about them</h4>${pre(String(lead.memory).slice(0, 3000))}` : ''}
        ${sections}
      </div>`,
    }),
  });
  return emailRes.ok;
}
