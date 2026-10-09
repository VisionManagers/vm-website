#!/usr/bin/env node
/**
 * Create the 60-minute BNI 1-to-1 event type in Calendly (API: POST /event_types), or list event types.
 *   CALENDLY_PAT=… node scripts/calendly-event.mjs list
 *   CALENDLY_PAT=… node scripts/calendly-event.mjs create-121
 * Prints the scheduling URL — paste it into constants.tsx BOOKING_URLS.BNI_121.
 * Questions, reminders and the booking window still get set in the Calendly UI (the API can't).
 */
const PAT = process.env.CALENDLY_PAT; if (!PAT) { console.error('set CALENDLY_PAT'); process.exit(1); }
const [cmd] = process.argv.slice(2);
const H = { Authorization: `Bearer ${PAT}`, 'Content-Type': 'application/json' };
const api = async (m, p, b) => { const r = await fetch(`https://api.calendly.com${p}`, { method: m, headers: H, body: b ? JSON.stringify(b) : undefined }); const j = await r.json().catch(() => ({})); if (!r.ok) { console.error(m, p, r.status, JSON.stringify(j)); process.exit(1); } return j; };
const me = (await api('GET', '/users/me')).resource;
if (cmd === 'list') {
  const j = await api('GET', `/event_types?user=${encodeURIComponent(me.uri)}&active=true`);
  for (const e of j.collection) console.log(`${e.duration} min  ${e.name}\n   ${e.scheduling_url}`);
} else if (cmd === 'create-121') {
  const j = await api('POST', '/event_types', {
    name: 'BNI 1-to-1 with Suk', duration: 60, kind: 'solo', host: me.uri, color: '#0B4C83',
    description_plain: 'An hour for BNI members: how we each get business, who we are listening for, and one concrete thing we can send each other this month. Bring the referrals you are unsure about.',
    locations: [{ kind: 'google_conference' }],
  });
  console.log(`created: ${j.resource.name} (${j.resource.duration} min)\n${j.resource.scheduling_url}\n→ paste into constants.tsx BOOKING_URLS.BNI_121; then in Calendly set availability to the people windows, reminders 24h/1h, 14-day window.`);
} else console.log('commands: list | create-121');
