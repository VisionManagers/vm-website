/** POST /api/bni-referral — a BNI member sends Suk a referral. Email to Suk + Airtable person (status cold, source bni). */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendMail, esc, NOTIFY_EMAIL } from './_lib/mail';
import { PEOPLE, PEOPLE_KEY, findPersonByEmail, findPersonBySlug, upsert, updateById, listAdd } from './_lib/airtable';
import { slugify } from './_lib/booking';

const rate = new Map<string, { n: number; reset: number }>();
function limited(ip: string) { const now = Date.now(); const e = rate.get(ip); if (!e || now > e.reset) { rate.set(ip, { n: 1, reset: now + 3600_000 }); return false; } if (e.n >= 10) return true; e.n++; return false; }

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 'unknown';
  if (limited(ip)) return res.status(429).json({ error: 'Too many requests' });
  const b = (req.body || {}) as Record<string, string>;
  const referrer = String(b.referrer || '').trim().slice(0, 80);
  const who = String(b.who || '').trim().slice(0, 120);
  const said = String(b.said || '').trim().slice(0, 500);
  const contact = String(b.contact || '').trim().slice(0, 120);
  const okToText = b.okToText === 'yes' || b.okToText === 'true';
  if (!referrer || !who) return res.status(400).json({ error: 'your name and who you are sending are required' });
  const today = new Date().toISOString().slice(0, 10);
  const html = `<p style="font:15px/1.6 Helvetica,Arial,sans-serif;color:#0A1722"><b>BNI referral from ${esc(referrer)}</b></p>
<table style="font:15px/1.6 Helvetica,Arial,sans-serif;color:#0A1722"><tr><td style="padding:3px 12px 3px 0">Who</td><td><b>${esc(who)}</b></td></tr>
<tr><td style="padding:3px 12px 3px 0">What they said</td><td>${esc(said) || '—'}</td></tr>
<tr><td style="padding:3px 12px 3px 0">Reach them</td><td>${esc(contact) || '— (ask ' + esc(referrer) + ')'}</td></tr>
<tr><td style="padding:3px 12px 3px 0">OK to text them</td><td>${okToText ? 'yes' : 'not confirmed — check with ' + esc(referrer)}</td></tr></table>
<p style="font:13px/1.6 Helvetica,Arial,sans-serif;color:#64748b">From visionmanagers.com/bni · ${today}. Text them today; tell ${esc(referrer)} what happened.</p>`;
  try { await sendMail({ to: NOTIFY_EMAIL, subject: `BNI referral: ${who} (from ${referrer})`, html }); }
  catch (err: any) { console.error('bni-referral mail failed', err?.message || err); return res.status(500).json({ error: 'could not send' }); }
  // CRM: best effort — the referred person as a cold record, the referrer named
  try {
    const email = (contact.match(/[^\s@]+@[^\s@]+\.[^\s@]+/) || [''])[0].toLowerCase();
    const phone = email ? '' : contact;
    const name = who.split(/[,\-–—(]/)[0].trim() || who;
    const note = `- ${today} — BNI referral from ${referrer}: "${said || '(no quote)'}"${contact ? ` · reach: ${contact}` : ''}${okToText ? ' · OK to text' : ''}`;
    const existing = email ? await findPersonByEmail(email) : null;
    if (existing) await updateById(PEOPLE, existing.id, { tags: listAdd(existing.fields.tags, 'bni-referral'), next_action: `Text them today — BNI referral from ${referrer}`, next_action_date: today, body_markdown: `${(existing.fields.body_markdown || '').trimEnd()}\n${note}` });
    else {
      let slug = slugify(name); if (await findPersonBySlug(slug)) slug = `${slug}-${Date.now().toString(36)}`;
      await upsert(PEOPLE, PEOPLE_KEY, { [PEOPLE_KEY]: slug, name, company: who.replace(name, '').replace(/^[\s,\-–—(]+|[)\s]+$/g, '').slice(0, 80), ...(email ? { email } : {}), ...(phone ? { phone } : {}),
        status: 'cold', source: 'bni', unit: 'n/a', first_contact: today, meeting_count: 0, paying: false, mrr: 0, warmth: 'warm', trust: 'unvetted', priority: 'B', cadence: 'monthly', tier: 'none',
        referred_by: referrer, tags: 'bni-referral', goal_fit: 'deal', next_action: `Text them today — BNI referral from ${referrer}`, next_action_date: today,
        body_markdown: `## Context\nReferred by ${referrer} (BNI) via visionmanagers.com/bni on ${today}.\n\n## Conversation history\n${note}` });
    }
  } catch (err: any) { console.error('bni-referral crm failed', err?.message || err); }
  return res.status(200).json({ ok: true });
}
