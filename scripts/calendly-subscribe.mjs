#!/usr/bin/env node
/**
 * Create (or list/delete) the Calendly webhook subscription that points at /api/booking-webhook.
 *
 *   CALENDLY_PAT=… node scripts/calendly-subscribe.mjs create https://visionmanagers.com/api/booking-webhook
 *   CALENDLY_PAT=… node scripts/calendly-subscribe.mjs list
 *   CALENDLY_PAT=… node scripts/calendly-subscribe.mjs delete <subscription uri>
 *
 * `create` prints the signing key — put it in Vercel as CALENDLY_WEBHOOK_SIGNING_KEY (you can also pass
 * CALENDLY_SIGNING_KEY=… to reuse one). PAT = Calendly → Integrations → API & Webhooks → personal access token.
 */
import { randomBytes } from 'node:crypto';

const PAT = process.env.CALENDLY_PAT;
if (!PAT) { console.error('set CALENDLY_PAT'); process.exit(1); }
const [cmd, arg] = process.argv.slice(2);
const H = { Authorization: `Bearer ${PAT}`, 'Content-Type': 'application/json' };
const api = async (method, path, body) => {
  const r = await fetch(`https://api.calendly.com${path}`, { method, headers: H, body: body ? JSON.stringify(body) : undefined });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) { console.error(method, path, r.status, JSON.stringify(j)); process.exit(1); }
  return j;
};

const me = (await api('GET', '/users/me')).resource;
const org = me.current_organization, user = me.uri;
console.log(`user: ${me.name} <${me.email}>\norg:  ${org}`);

if (cmd === 'list') {
  const j = await api('GET', `/webhook_subscriptions?organization=${encodeURIComponent(org)}&user=${encodeURIComponent(user)}&scope=user`);
  for (const s of j.collection) console.log(`${s.state}  ${s.uri}\n   → ${s.callback_url}  [${s.events.join(', ')}]`);
  if (!j.collection.length) console.log('(none)');
} else if (cmd === 'create') {
  if (!arg) { console.error('usage: create <callback url>'); process.exit(1); }
  const signing_key = process.env.CALENDLY_SIGNING_KEY || randomBytes(32).toString('hex');
  const j = await api('POST', '/webhook_subscriptions', {
    url: arg, events: ['invitee.created', 'invitee.canceled'], organization: org, user, scope: 'user', signing_key,
  });
  console.log(`created: ${j.resource.uri}\nstate:   ${j.resource.state}\n\nCALENDLY_WEBHOOK_SIGNING_KEY=${signing_key}\n(add that to Vercel → Settings → Environment Variables, then redeploy)`);
} else if (cmd === 'delete') {
  const uuid = arg?.split('/').pop();
  if (!uuid) { console.error('usage: delete <subscription uri>'); process.exit(1); }
  await api('DELETE', `/webhook_subscriptions/${uuid}`);
  console.log('deleted');
} else {
  console.log('commands: list | create <url> | delete <uri>');
}
