/** Resend helper shared by the BNI routes. Attachments are base64 strings. */
export async function sendMail(opts: { to: string; subject: string; html: string; attachments?: { filename: string; content: string }[]; replyTo?: string }) {
  const key = process.env.RESEND_API_KEY; if (!key) throw new Error('RESEND_API_KEY not set');
  const r = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: 'Vision Managers <notifications@visionmanagers.com>', to: opts.to, subject: opts.subject, html: opts.html, reply_to: opts.replyTo, attachments: opts.attachments }) });
  if (!r.ok) throw new Error(`resend ${r.status}: ${(await r.text()).slice(0, 200)}`);
}
export const esc = (s: unknown) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string));
export const NOTIFY_EMAIL = 'sukhneet@visionmanagers.com';
