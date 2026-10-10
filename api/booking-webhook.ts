/**
 * POST /api/booking-webhook — Calendly webhook receiver → Airtable CRM.
 * Verifies the Calendly-Webhook-Signature header (t=<unix>,v1=<hmac-sha256 hex of "<t>.<raw body>")
 * with CALENDLY_WEBHOOK_SIGNING_KEY, rejects anything older than 5 minutes, then hands the event to
 * api/_lib/booking.ts. Needs AIRTABLE_TOKEN + AIRTABLE_BASE too.
 *
 * Subscribe Calendly to this URL with scripts/calendly-subscribe.mjs.
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { handleCalendlyEvent } from './_lib/booking.js';

export const config = { api: { bodyParser: false } };

const TOLERANCE_S = 300;

async function rawBody(req: VercelRequest): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const c of req) chunks.push(typeof c === 'string' ? Buffer.from(c) : c);
  return Buffer.concat(chunks).toString('utf8');
}

export function verifySignature(header: string | undefined, body: string, key: string): { ok: boolean; why?: string } {
  if (!header) return { ok: false, why: 'missing signature header' };
  const parts = Object.fromEntries(header.split(',').map((kv) => kv.trim().split('=') as [string, string]));
  const t = parts.t, v1 = parts.v1;
  if (!t || !v1) return { ok: false, why: 'malformed signature header' };
  const age = Math.abs(Date.now() / 1000 - Number(t));
  if (!Number.isFinite(age) || age > TOLERANCE_S) return { ok: false, why: 'timestamp outside tolerance' };
  const expected = createHmac('sha256', key).update(`${t}.${body}`).digest('hex');
  const a = Buffer.from(expected), b = Buffer.from(v1);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return { ok: false, why: 'signature mismatch' };
  return { ok: true };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const key = process.env.CALENDLY_WEBHOOK_SIGNING_KEY;
  if (!key) return res.status(500).json({ error: 'CALENDLY_WEBHOOK_SIGNING_KEY not configured' });

  const body = await rawBody(req);
  const sig = (req.headers['calendly-webhook-signature'] as string | undefined) ?? (req.headers['Calendly-Webhook-Signature'] as string | undefined);
  const v = verifySignature(sig, body, key);
  if (!v.ok) return res.status(401).json({ error: v.why });

  let evt: any;
  try { evt = JSON.parse(body); } catch { return res.status(400).json({ error: 'invalid JSON' }); }

  try {
    const result = await handleCalendlyEvent(evt);
    console.log('booking-webhook', JSON.stringify(result));
    return res.status(200).json(result);
  } catch (err: any) {
    console.error('booking-webhook failed', err?.message || err);
    // 500 makes Calendly retry (it retries failed deliveries with backoff).
    return res.status(500).json({ error: 'crm write failed' });
  }
}
