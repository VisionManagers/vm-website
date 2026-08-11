import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

/* Daily lead-activity digest for Suk: every lead active in the last 24h,
   with full chat transcripts, tool runs, and the memory profile the AI
   has built on them. Triggered by Vercel cron (see vercel.json); guarded
   by CRON_SECRET, which Vercel sends as a Bearer token automatically. */

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NOTIFY_EMAIL = 'sukhneet@visionmanagers.com';

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const pre = (s: string) =>
  `<pre style="white-space:pre-wrap;font-family:Georgia,serif;font-size:13px;background:#f8fafc;padding:12px;border-left:3px solid #00C2B2;margin:8px 0;">${escapeHtml(s)}</pre>`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const auth = req.headers['authorization'];
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !RESEND_API_KEY) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  // Active = counted a run today or yesterday (runs_date is bumped on every
  // model call, so this also catches chat rows that were updated in place)
  const cutoff = new Date(Date.now() - 48 * 3600 * 1000).toISOString().slice(0, 10);
  const { data: leads, error } = await supabase
    .from('lab_leads')
    .select('*')
    .gte('runs_date', cutoff)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Digest lead query failed:', error);
    return res.status(500).json({ error: 'Query failed' });
  }
  if (!leads || leads.length === 0) {
    return res.status(200).json({ sent: false, reason: 'No activity' });
  }

  const sections: string[] = [];
  for (const lead of leads) {
    const { data: runs } = await supabase
      .from('lab_runs')
      .select('tool, input, output, created_at')
      .eq('lead_id', lead.id)
      .order('created_at', { ascending: true })
      .limit(20);

    const runHtml = (runs || []).map((run) => {
      const isTranscript = Array.isArray(run.input);
      if (isTranscript) {
        const transcript = (run.input as { role: string; content: string }[])
          .map((m) => `${m.role === 'user' ? '👤 THEM' : '🤖 AI'}: ${m.content}`)
          .join('\n\n');
        return `<h4 style="margin:16px 0 4px;">💬 ${escapeHtml(run.tool)} conversation (${(run.input as unknown[]).length} messages)</h4>${pre(transcript.slice(0, 8000))}`;
      }
      const inputNote = run.input && typeof run.input === 'object'
        ? Object.values(run.input as Record<string, string>).filter(Boolean).join(' | ')
        : '';
      return `<h4 style="margin:16px 0 4px;">🔧 ${escapeHtml(run.tool)}</h4>
        ${inputNote ? `<p style="margin:4px 0;"><em>Input:</em> ${escapeHtml(inputNote.slice(0, 800))}</p>` : ''}
        ${pre((run.output || '').slice(0, 6000))}`;
    }).join('');

    sections.push(`
      <div style="border:1px solid #e2e8f0;border-radius:4px;padding:20px;margin:20px 0;">
        <h2 style="margin:0 0 4px;color:#0B4C83;">${escapeHtml(lead.business_name)}</h2>
        <p style="margin:0 0 12px;color:#475569;">${escapeHtml(lead.name || '')} · ${escapeHtml(lead.email)}${lead.phone ? ` · ${escapeHtml(lead.phone)}` : ''}${lead.website ? ` · ${escapeHtml(lead.website)}` : ''} · ${Number(lead.daily_runs) || 0} runs today</p>
        ${lead.memory ? `<h4 style="margin:12px 0 4px;">🧠 What the AI knows about them</h4>${pre(String(lead.memory).slice(0, 3000))}` : ''}
        ${runHtml || '<p><em>No stored runs.</em></p>'}
      </div>`);
  }

  const emailRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'Vision Managers <notifications@visionmanagers.com>',
      to: NOTIFY_EMAIL,
      subject: `Workbench digest: ${leads.length} active lead${leads.length === 1 ? '' : 's'}`,
      html: `<div style="font-family:Georgia,serif;max-width:680px;margin:0 auto;color:#1e293b;">
        <h1 style="color:#0B4C83;">The Workbench — daily lead digest</h1>
        ${sections.join('')}
      </div>`,
    }),
  });

  if (!emailRes.ok) {
    console.error('Digest send failed:', await emailRes.text());
    return res.status(502).json({ error: 'Email failed' });
  }
  return res.status(200).json({ sent: true, leads: leads.length });
}
