import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import React from 'react';
import { Document, Page, Text, View, StyleSheet, renderToBuffer } from '@react-pdf/renderer';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NOTIFY_EMAIL = 'sukhneet@visionmanagers.com';

// Simple in-memory rate limiting (resets on cold start)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
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

const NAVY = '#0B4C83';
const TEAL = '#00C2B2';
const SLATE = '#475569';

const styles = StyleSheet.create({
  page: { paddingTop: 56, paddingBottom: 64, paddingHorizontal: 52, fontSize: 10, fontFamily: 'Helvetica', color: '#1e293b', lineHeight: 1.55 },
  coverBand: { backgroundColor: NAVY, marginHorizontal: -52, marginTop: -56, paddingHorizontal: 52, paddingTop: 48, paddingBottom: 40 },
  brand: { fontSize: 9, color: TEAL, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14, fontFamily: 'Helvetica-Bold' },
  coverTitle: { fontSize: 26, color: '#ffffff', fontFamily: 'Times-Roman', marginBottom: 6 },
  coverBusiness: { fontSize: 14, color: TEAL, fontFamily: 'Times-Italic' },
  coverMeta: { fontSize: 9, color: '#94a3b8', marginTop: 14 },
  sectionTitle: { fontSize: 16, color: NAVY, fontFamily: 'Times-Roman', marginTop: 26, marginBottom: 4, paddingBottom: 4, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  h2: { fontSize: 13, color: NAVY, fontFamily: 'Times-Roman', marginTop: 14, marginBottom: 4 },
  h3: { fontSize: 11, color: NAVY, fontFamily: 'Helvetica-Bold', marginTop: 10, marginBottom: 3 },
  para: { marginBottom: 6 },
  bulletRow: { flexDirection: 'row', marginBottom: 3, paddingLeft: 6 },
  bulletDot: { width: 12, color: TEAL, fontFamily: 'Helvetica-Bold' },
  bulletText: { flex: 1 },
  bold: { fontFamily: 'Helvetica-Bold', color: NAVY },
  footer: { position: 'absolute', bottom: 28, left: 52, right: 52, flexDirection: 'row', justifyContent: 'space-between', fontSize: 8, color: '#94a3b8', borderTopWidth: 1, borderTopColor: '#e2e8f0', paddingTop: 8 },
  ctaBox: { marginTop: 28, backgroundColor: '#f0fdfa', borderLeftWidth: 3, borderLeftColor: TEAL, padding: 14 },
  ctaTitle: { fontFamily: 'Helvetica-Bold', color: NAVY, fontSize: 11, marginBottom: 4 },
});

const e = React.createElement;

/* Render **bold** segments inside a line */
function inline(line: string): React.ReactNode[] {
  const parts = line.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? e(Text, { key: i, style: styles.bold }, part) : part
  );
}

/* Convert the model's markdown into react-pdf elements */
function markdownBlocks(md: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  lines.forEach((raw, i) => {
    const line = raw.trim();
    if (!line || /^---+$/.test(line)) return;
    if (line.startsWith('## ')) {
      nodes.push(e(Text, { key: i, style: styles.h2 }, line.slice(3).replace(/\*\*/g, '')));
    } else if (line.startsWith('### ')) {
      nodes.push(e(Text, { key: i, style: styles.h3 }, line.slice(4).replace(/\*\*/g, '')));
    } else if (/^[-*]\s/.test(line)) {
      nodes.push(
        e(View, { key: i, style: styles.bulletRow },
          e(Text, { style: styles.bulletDot }, '•'),
          e(Text, { style: styles.bulletText }, ...inline(line.replace(/^[-*]\s+/, ''))))
      );
    } else if (/^\d+\.\s/.test(line)) {
      const num = line.match(/^(\d+)\./)?.[1] || '';
      nodes.push(
        e(View, { key: i, style: styles.bulletRow },
          e(Text, { style: styles.bulletDot }, `${num}.`),
          e(Text, { style: styles.bulletText }, ...inline(line.replace(/^\d+\.\s+/, ''))))
      );
    } else {
      nodes.push(e(Text, { key: i, style: styles.para }, ...inline(line)));
    }
  });
  return nodes;
}

const TOOL_TITLES: Record<string, string> = {
  deals: 'Deal Finder — Hidden Revenue Opportunities',
  coach: 'Business Coach — Your Session',
  marketing: 'Marketing Studio — Ready-to-Use Copy',
  leads: 'Lead Machine — Your Acquisition Playbook',
};

// Conversational tools render as transcripts rather than documents
const TRANSCRIPT_TITLES: Record<string, { title: string; user: string; agent: string }> = {
  chat: { title: 'Try to Stump It — Your Conversation with the Agent', user: 'You', agent: 'Agent' },
  scout: { title: 'Deal Scout — Your Property Hunt', user: 'You', agent: 'Scout' },
};

interface RunRow { tool: string; output: string; input: unknown; created_at: string }

function buildPdf(lead: { name: string | null; business_name: string; industry: string | null; city: string | null }, runs: RunRow[]) {
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const generatorRuns = runs.filter((r) => !(r.tool in TRANSCRIPT_TITLES));
  const transcriptRuns = runs.filter((r) => r.tool in TRANSCRIPT_TITLES && Array.isArray(r.input));

  const children: React.ReactNode[] = [
    e(View, { style: styles.coverBand },
      e(Text, { style: styles.brand }, 'Vision Managers · The Lab'),
      e(Text, { style: styles.coverTitle }, 'Your AI Workbench Report'),
      e(Text, { style: styles.coverBusiness },
        `Prepared for ${lead.business_name}${lead.industry ? ` · ${lead.industry}` : ''}${lead.city ? ` · ${lead.city}` : ''}`),
      e(Text, { style: styles.coverMeta },
        `${date} — Every word below was generated live by the same AI systems Vision Managers installs for client practices.`)
    ),
  ];

  for (const run of generatorRuns) {
    children.push(e(Text, { style: styles.sectionTitle }, TOOL_TITLES[run.tool] || run.tool));
    children.push(...markdownBlocks(run.output));
  }

  for (const run of transcriptRuns) {
    const meta = TRANSCRIPT_TITLES[run.tool];
    children.push(e(Text, { style: styles.sectionTitle }, meta.title));
    for (const msg of (run.input as { role: string; content: string }[]).slice(0, 30)) {
      if (msg.role === 'assistant' && run.tool === 'scout') {
        // Scout replies are markdown deal reports — render them properly
        children.push(e(Text, { style: { ...styles.h3, color: TEAL } }, meta.agent));
        children.push(...markdownBlocks(msg.content));
      } else {
        children.push(
          e(View, { style: styles.bulletRow },
            e(Text, { style: { ...styles.bulletDot, width: 40 } }, msg.role === 'user' ? meta.user : meta.agent),
            e(Text, { style: styles.bulletText }, msg.content))
        );
      }
    }
  }

  children.push(
    e(View, { style: styles.ctaBox },
      e(Text, { style: styles.ctaTitle }, 'This took the AI a few minutes. Imagine it working for you every day.'),
      e(Text, null,
        'Everything in this report came from a demo with only the few details you typed in. With your real numbers, calendar, and phone line connected, this becomes a system that answers, books, follows up, and finds revenue while you work. Book a 20-minute discovery call at visionmanagers.com/start — the conversation itself becomes your AI Opportunity Snapshot, delivered in writing the next day.')
    )
  );

  return e(Document, { title: `AI Workbench Report — ${lead.business_name}`, author: 'Vision Managers' },
    e(Page, { size: 'LETTER', style: styles.page },
      ...children,
      e(View, { style: styles.footer, fixed: true },
        e(Text, null, 'Vision Managers — Operational AI for high-trust businesses'),
        e(Text, { render: ({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) => `${pageNumber} / ${totalPages}` })
      )
    )
  );
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !RESEND_API_KEY) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many report requests. Please try again later.' });
  }

  const { leadId } = req.body || {};
  if (!leadId || typeof leadId !== 'string') {
    return res.status(400).json({ error: 'Missing session.' });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  const { data: lead, error: leadError } = await supabase
    .from('lab_leads').select('*').eq('id', leadId).single();
  if (leadError || !lead) {
    return res.status(404).json({ error: 'Session not found.' });
  }

  const { data: runs } = await supabase
    .from('lab_runs')
    .select('tool, output, input, created_at')
    .eq('lead_id', leadId)
    .order('created_at', { ascending: true });

  if (!runs || runs.length === 0) {
    return res.status(400).json({ error: 'Try at least one tool first — then your report will have something in it.' });
  }

  try {
    const pdfBuffer = await renderToBuffer(buildPdf(lead, runs) as React.ReactElement);
    const filename = `AI-Workbench-Report-${lead.business_name.replace(/[^a-zA-Z0-9]+/g, '-')}.pdf`;

    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Vision Managers <notifications@visionmanagers.com>',
        to: lead.email,
        bcc: NOTIFY_EMAIL,
        subject: `Your AI Workbench Report — ${lead.business_name}`,
        html: `
          <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1e293b;">
            <div style="background:#0B4C83;padding:32px;border-radius:4px 4px 0 0;">
              <p style="color:#00E5D1;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0 0 12px;font-family:Helvetica,Arial,sans-serif;">Vision Managers · The Lab</p>
              <h1 style="color:#fff;font-size:24px;margin:0;font-weight:normal;">Your AI Workbench Report</h1>
            </div>
            <div style="padding:32px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 4px 4px;">
              <p>Hi ${lead.name || 'there'},</p>
              <p>Attached is everything the AI built for <strong>${lead.business_name}</strong> in the Lab just now — your revenue opportunities, coaching notes, marketing copy, and lead-generation playbook, formatted to keep.</p>
              <p>It was generated from just the few details you typed in. Connected to your real calendar, phone line, and numbers, this becomes a system working for you every day.</p>
              <p style="margin:28px 0;">
                <a href="https://visionmanagers.com/start" style="background:#0B4C83;color:#fff;padding:14px 28px;text-decoration:none;border-radius:2px;font-family:Helvetica,Arial,sans-serif;font-size:14px;">See what it looks like in your business</a>
              </p>
              <p style="color:#64748b;font-size:13px;">— Sukhneet, Vision Managers</p>
            </div>
          </div>`,
        attachments: [
          { filename, content: pdfBuffer.toString('base64') },
        ],
      }),
    });

    if (!emailRes.ok) {
      const detail = await emailRes.text();
      console.error('Resend error:', detail);
      return res.status(502).json({ error: 'Report generated, but the email failed to send. Try again.' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Report generation error:', err);
    return res.status(500).json({ error: 'Failed to build the report. Try again in a moment.' });
  }
}
