/** POST /api/bni-testimonial — typed words or a voice note (base64 audio ≤ 3 MB). Email to Suk (audio attached) + Airtable touchpoint (best effort). Nothing is published automatically. */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendMail, esc, NOTIFY_EMAIL } from './_lib/mail';
import { TOUCHPOINTS, TOUCHPOINT_KEY, upsert } from './_lib/airtable';
import { slugify } from './_lib/booking';

const rate = new Map<string, { n: number; reset: number }>();
function limited(ip: string) { const now = Date.now(); const e = rate.get(ip); if (!e || now > e.reset) { rate.set(ip, { n: 1, reset: now + 3600_000 }); return false; } if (e.n >= 6) return true; e.n++; return false; }

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 'unknown';
  if (limited(ip)) return res.status(429).json({ error: 'Too many requests' });
  const b = (req.body || {}) as Record<string, string>;
  const name = String(b.name || '').trim().slice(0, 80);
  const business = String(b.business || '').trim().slice(0, 120);
  const words = String(b.words || '').trim().slice(0, 2000);
  const okToUse = b.okToUse === 'yes' || b.okToUse === 'true';
  const audio = typeof b.audio === 'string' ? b.audio : '';
  const mime = String(b.mime || 'audio/webm').slice(0, 40);
  if (!name) return res.status(400).json({ error: 'your name is required' });
  if (!words && !audio) return res.status(400).json({ error: 'type something or record a voice note' });
  if (audio && audio.length > 4_200_000) return res.status(413).json({ error: 'voice note too long — keep it under 90 seconds' });
  const today = new Date().toISOString().slice(0, 10);
  const kind = audio ? 'voice note' : 'written';
  const html = `<p style="font:15px/1.6 Helvetica,Arial,sans-serif;color:#0A1722"><b>Testimonial (${kind}) from ${esc(name)}${business ? ', ' + esc(business) : ''}</b></p>
${words ? `<blockquote style="font:16px/1.6 Georgia,serif;color:#0A1722;border-left:3px solid #0B4C83;margin:0;padding:4px 14px">${esc(words)}</blockquote>` : '<p style="font:14px/1.6 Helvetica,Arial,sans-serif;color:#0A1722">Audio attached.</p>'}
<p style="font:14px/1.6 Helvetica,Arial,sans-serif;color:#0A1722">Permission to use with their name: <b>${okToUse ? 'YES (checked on the page)' : 'not given — ask before any public use'}</b></p>
<p style="font:13px/1.6 Helvetica,Arial,sans-serif;color:#64748b">From visionmanagers.com/bni · ${today}. Log it in proof-library via the testimonial skill; nothing is published automatically.</p>`;
  const ext = mime.includes('mp4') ? 'm4a' : mime.includes('ogg') ? 'ogg' : 'webm';
  try { await sendMail({ to: NOTIFY_EMAIL, subject: `Testimonial (${kind}): ${name}${business ? ' — ' + business : ''}`, html, attachments: audio ? [{ filename: `testimonial-${slugify(name)}-${today}.${ext}`, content: audio }] : undefined }); }
  catch (err: any) { console.error('bni-testimonial mail failed', err?.message || err); return res.status(500).json({ error: 'could not send' }); }
  try {
    const slug = `${today}-${slugify(name)}-testimonial`;
    await upsert(TOUCHPOINTS, TOUCHPOINT_KEY, { [TOUCHPOINT_KEY]: slug, type: 'testimonial', date: today, event: `Testimonial (${kind}) left on /bni by ${name}${business ? ', ' + business : ''} — permission ${okToUse ? 'GRANTED (checkbox)' : 'not given'}`, people: name, source: 'website-bni', tags: `testimonial; bni${okToUse ? '; permission-granted' : ''}`, body_markdown: `# ${name} — testimonial, ${today}\n\n${words ? `> ${words}\n\n` : 'Voice note emailed to Suk.\n\n'}Permission to use with name: ${okToUse ? 'yes (checkbox on /bni)' : 'not given'}.` });
  } catch (err: any) { console.error('bni-testimonial crm failed', err?.message || err); }
  return res.status(200).json({ ok: true });
}
