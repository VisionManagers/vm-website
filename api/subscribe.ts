/**
 * POST /api/subscribe { email, source?, name? } — replaces the GoHighLevel inbound webhook the
 * Insights / Digest forms used. Upserts the person in the Airtable CRM (by email) and tags them
 * `insights-subscriber`. Nothing else: no email is sent from here.
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PEOPLE, PEOPLE_KEY, findPersonByEmail, findPersonBySlug, upsert, updateById, listAdd } from './_lib/airtable.js';
import { slugify } from './_lib/booking.js';

const rate = new Map<string, { n: number; reset: number }>();
function limited(ip: string) {
  const now = Date.now(); const e = rate.get(ip);
  if (!e || now > e.reset) { rate.set(ip, { n: 1, reset: now + 3600_000 }); return false; }
  if (e.n >= 20) return true; e.n++; return false;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 'unknown';
  if (limited(ip)) return res.status(429).json({ error: 'Too many requests' });

  const { email, source, name } = (req.body || {}) as { email?: string; source?: string; name?: string };
  const em = String(email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) return res.status(400).json({ error: 'valid email required' });
  const src = String(source || 'website').slice(0, 80);
  const today = new Date().toISOString().slice(0, 10);

  try {
    const existing = await findPersonByEmail(em);
    if (existing) {
      await updateById(PEOPLE, existing.id, {
        tags: listAdd(existing.fields.tags, 'insights-subscriber'),
        body_markdown: `${(existing.fields.body_markdown || '').trimEnd()}\n- ${today} — subscribed via ${src}`,
      });
      return res.status(200).json({ ok: true, action: 'tagged' });
    }
    const display = String(name || '').trim() || em.split('@')[0];
    let slug = slugify(display);
    const clash = await findPersonBySlug(slug);
    if (clash) slug = `${slug}-${slugify(em.split('@')[0])}`.slice(0, 60);
    await upsert(PEOPLE, PEOPLE_KEY, {
      [PEOPLE_KEY]: slug, name: display, email: em,
      status: 'cold', source: 'inbound', unit: 'n/a', first_contact: today, meeting_count: 0, paying: false, mrr: 0,
      warmth: 'cold', trust: 'unvetted', priority: 'C', cadence: 'quarterly', tier: 'none',
      tags: 'insights-subscriber', goal_fit: 'relationship',
      body_markdown: `## Context\nSubscribed via ${src} on ${today}. No conversation yet.\n\n## Conversation history\n- ${today} — subscribed (${src})`,
    });
    return res.status(200).json({ ok: true, action: 'created' });
  } catch (err: any) {
    console.error('subscribe failed', err?.message || err);
    return res.status(500).json({ error: 'could not save subscription' });
  }
}
