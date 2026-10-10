/**
 * POST /api/bid-save — "Keep this bid": emails the visitor their numbers + the reopen link (Resend),
 * tags them in the Airtable CRM (bid-calculator), and tells Suk. One email, no drip.
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PEOPLE, PEOPLE_KEY, findPersonByEmail, findPersonBySlug, upsert, updateById, listAdd } from './_lib/airtable.js';
import { slugify } from './_lib/booking.js';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NOTIFY_EMAIL = 'sukhneet@visionmanagers.com';
const money = (n: number) => '$' + Math.round(n || 0).toLocaleString('en-US');
const rate = new Map<string, { n: number; reset: number }>();
function limited(ip: string) { const now = Date.now(); const e = rate.get(ip); if (!e || now > e.reset) { rate.set(ip, { n: 1, reset: now + 3600_000 }); return false; } if (e.n >= 10) return true; e.n++; return false; }

async function send(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY not set');
  const r = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: 'Vision Managers <notifications@visionmanagers.com>', to, subject, html }) });
  if (!r.ok) throw new Error(`resend ${r.status}`);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 'unknown';
  if (limited(ip)) return res.status(429).json({ error: 'Too many requests' });
  const { email, inputs, result, url, tradeLabel, jobLabel } = (req.body || {}) as any;
  const em = String(email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em) || !inputs || !result) return res.status(400).json({ error: 'email, inputs and result required' });
  const safeUrl = typeof url === 'string' && url.startsWith('https://visionmanagers.com/tools/bid-calculator') ? url : 'https://visionmanagers.com/tools/bid-calculator';
  const priced = result.price != null && result.gp != null;
  const lines = [
    `<p style="font:16px/1.5 Helvetica,Arial,sans-serif;color:#0A1722">Your bid — <b>${String(tradeLabel || '').slice(0, 40)} · ${String(jobLabel || '').slice(0, 40)}</b></p>`,
    `<table style="border-collapse:collapse;font:15px/1.6 Helvetica,Arial,sans-serif;color:#0A1722">`,
    `<tr><td style="padding:4px 12px 4px 0">Cost</td><td><b>${money(result.cost)}</b></td></tr>`,
    priced ? `<tr><td style="padding:4px 12px 4px 0">Your price</td><td><b>${money(result.price)}</b> → ${money(result.gp)} gross profit (${Math.round((result.gpPct || 0) * 100)}%)</td></tr>` : '',
    `<tr><td style="padding:4px 12px 4px 0">Charge this at 50% / 55% / 60%</td><td><b>${money(result.chargeAt?.[50])}</b> / ${money(result.chargeAt?.[55])} / ${money(result.chargeAt?.[60])}</td></tr>`,
    result.jobsPerMonth != null ? `<tr><td style="padding:4px 12px 4px 0">Jobs like this to cover overhead</td><td><b>${result.jobsPerMonth}</b> a month${result.leadsPerMonth != null ? ` (about ${result.leadsPerMonth} bids)` : ''}</td></tr>` : '',
    `<tr><td style="padding:4px 12px 4px 0">Hours a year writing bids</td><td><b>${Number(result.hoursPerYear || 0).toLocaleString()}</b></td></tr>`,
    `</table>`,
    `<p style="font:15px/1.6 Helvetica,Arial,sans-serif;color:#0A1722"><a href="${safeUrl}">Reopen this bid with your numbers</a> — change anything and it recalculates.</p>`,
    `<p style="font:15px/1.6 Helvetica,Arial,sans-serif;color:#0A1722">If you want bids like this written in minutes from your own past bids: <a href="https://visionmanagers.com/book">book 20 minutes</a> — you leave knowing what your bids should earn.</p>`,
    `<p style="font:13px/1.6 Helvetica,Arial,sans-serif;color:#64748b">Suk Virk · Vision Managers · (425) 494-4489. One email, no list.</p>`,
  ].join('');
  try {
    await send(em, `Your bid: ${money(result.cost)} of cost, charge ${money(result.chargeAt?.[50])} at the floor`, lines);
  } catch (err: any) { console.error('bid-save email failed', err?.message || err); return res.status(500).json({ error: 'email failed' }); }
  // CRM + notify are best-effort
  try {
    const existing = await findPersonByEmail(em);
    const note = `- ${new Date().toISOString().slice(0, 10)} — ran the Bid Calculator (${tradeLabel} · ${jobLabel}): cost ${money(result.cost)}${priced ? `, quoted ${money(result.price)} (${Math.round((result.gpPct || 0) * 100)}% GP)` : ''}; ${result.hoursPerYear} h/yr on bids. ${safeUrl}`;
    if (existing) await updateById(PEOPLE, existing.id, { tags: listAdd(existing.fields.tags, 'bid-calculator'), body_markdown: `${(existing.fields.body_markdown || '').trimEnd()}\n${note}` });
    else {
      let slug = slugify(em.split('@')[0]); if (await findPersonBySlug(slug)) slug = `${slug}-${Date.now().toString(36)}`;
      await upsert(PEOPLE, PEOPLE_KEY, { [PEOPLE_KEY]: slug, name: em.split('@')[0], email: em, status: 'cold', source: 'inbound', unit: 'n/a', first_contact: new Date().toISOString().slice(0, 10), meeting_count: 0, paying: false, mrr: 0, warmth: 'warm', trust: 'unvetted', priority: 'B', cadence: 'monthly', tier: 'none', tags: 'bid-calculator; trades', goal_fit: 'deal', industry: String(tradeLabel || '').slice(0, 40), body_markdown: `## Context\nSaved a bid from the Bid Calculator.\n\n## Conversation history\n${note}` });
    }
  } catch (err: any) { console.error('bid-save crm failed', err?.message || err); }
  try { await send(NOTIFY_EMAIL, `Bid Calculator save: ${em} (${tradeLabel})`, lines); } catch { /* ignore */ }
  return res.status(200).json({ ok: true });
}
