/**
 * Live round-trip test of api/_lib/booking.ts against the real Airtable base, then cleanup.
 *   npx tsx scripts/test-booking.ts            (reads ~/.config/vm/airtable.env like the vault sync)
 *   npx tsx scripts/test-booking.ts --keep     (leave the test records in place to inspect)
 * Also signs a sample payload and checks verifySignature() the way Calendly will.
 */
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { createHmac } from 'node:crypto';
import { handleCalendlyEvent } from '../api/_lib/booking';
import { verifySignature } from '../api/booking-webhook';
import { PEOPLE, TOUCHPOINTS, findPersonByEmail, findTouchpointBySlug, deleteById } from '../api/_lib/airtable';

for (const line of readFileSync(`${homedir()}/.config/vm/airtable.env`, 'utf8').split('\n')) {
  const m = line.match(/^(\w+)=(.*)$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
}
const keep = process.argv.includes('--keep');
if (process.argv.includes('--cleanup')) {  // delete whatever a --keep run left behind, then exit
  const p = await findPersonByEmail('zz-test-booking@example.com'); if (p) await deleteById(PEOPLE, p.id);
  const slugs = ['2026-10-04-zz-test-booking-booking'];
  for (const d of [1, 2, 3, 4, 5]) { const dt = new Date(Date.now() + d * 86400_000).toISOString().slice(0, 10); slugs.push(`${dt}-zz-test-booking-booking`); }
  for (const sl of slugs) { const t = await findTouchpointBySlug(sl); if (t) await deleteById(TOUCHPOINTS, t.id); }
  console.log('cleanup only: done'); process.exit(0);
}
const EMAIL = 'zz-test-booking@example.com';
const start = new Date(Date.now() + 3 * 86400_000); start.setUTCHours(17, 0, 0, 0); // 10:00 PT-ish, 3 days out
const base = {
  created_at: new Date().toISOString(),
  payload: {
    name: 'Zz Test Booking', first_name: 'Zz', last_name: 'Test Booking', email: EMAIL,
    text_reminder_number: '+14255550100', timezone: 'America/Los_Angeles',
    questions_and_answers: [
      { question: 'What does your business do, in one line?', answer: 'Test roofing company', position: 0 },
      { question: 'Which leak do you suspect?', answer: 'Missed calls after hours', position: 1 },
    ],
    scheduled_event: { uri: 'https://api.calendly.com/scheduled_events/TEST', name: '20 minutes with Suk', start_time: start.toISOString(), end_time: new Date(start.getTime() + 20 * 60_000).toISOString() },
    cancel_url: 'https://calendly.com/cancellations/TEST', reschedule_url: 'https://calendly.com/reschedulings/TEST', status: 'active',
    uri: 'https://api.calendly.com/scheduled_events/TEST/invitees/TEST',
  },
};

// 1. signature check
const key = 'test-signing-key'; const body = JSON.stringify({ event: 'invitee.created', ...base });
const t = Math.floor(Date.now() / 1000);
const v1 = createHmac('sha256', key).update(`${t}.${body}`).digest('hex');
console.log('signature ok     :', verifySignature(`t=${t},v1=${v1}`, body, key));
console.log('signature tamper :', verifySignature(`t=${t},v1=${v1}`, body + ' ', key));
console.log('signature stale  :', verifySignature(`t=${t - 3600},v1=${v1}`, body, key));

// 2. created
const r1 = await handleCalendlyEvent({ event: 'invitee.created', ...base } as any);
console.log('created          :', r1);
const person = await findPersonByEmail(EMAIL);
console.log('person fields    :', person && { nameid: person.fields.nameid, status: person.fields.status, next_action: person.fields.next_action, next_action_date: person.fields.next_action_date, tags: person.fields.tags, phone: person.fields.phone });
const tp = await findTouchpointBySlug((r1 as any).touchpointSlug);
console.log('touchpoint       :', tp && { slug: tp.fields.slug, type: tp.fields.type, date: tp.fields.date, event: tp.fields.event, people: tp.fields.people });

// 3. second booking by the same person → update path (no duplicate)
const r2 = await handleCalendlyEvent({ event: 'invitee.created', ...base } as any);
console.log('re-created       :', r2.action, (r2 as any).personId === (r1 as any).personId ? '(same person record ✓)' : '(DUPLICATE person ✗)');

// 4. canceled
const r3 = await handleCalendlyEvent({ event: 'invitee.canceled', ...base, payload: { ...base.payload, status: 'canceled', cancellation: { canceler_type: 'invitee', reason: 'conflict came up' } } } as any);
console.log('cancelled        :', r3);
const tp2 = await findTouchpointBySlug((r1 as any).touchpointSlug);
const p2 = await findPersonByEmail(EMAIL);
console.log('after cancel     :', { event: tp2?.fields.event, tags: tp2?.fields.tags, next_action: p2?.fields.next_action });

// 5. cleanup
if (!keep) {
  if (p2) await deleteById(PEOPLE, p2.id);
  if (tp2) await deleteById(TOUCHPOINTS, tp2.id);
  console.log('cleanup          : test records deleted');
} else console.log('kept test records (nameid zz-test-booking)');
