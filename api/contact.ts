import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NOTIFY_EMAIL = 'sukhneet@visionmanagers.com';

// Simple in-memory rate limiting (resets on cold start)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT) {
    return true;
  }

  entry.count++;
  return false;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  const { name, email, phone, practice, website, interest, message } = req.body || {};

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'A valid email is required.' });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  const { error } = await supabase.from('contact_submissions').insert({
    name: name || null,
    email,
    phone: phone || null,
    practice: practice || null,
    website: website || null,
    interest: interest || null,
    message: message || null,
  });

  if (error) {
    console.error('Supabase insert error:', error);
    return res.status(500).json({ error: 'Failed to save submission.' });
  }

  // Send email notification (non-blocking — don't fail the submission if email fails)
  if (RESEND_API_KEY) {
    const interestLabel: Record<string, string> = {
      'voice-ai': 'Voice AI for my practice',
      'ai-training': 'AI Training',
      'automation': 'AI & automation strategy',
      'unsure': 'Not sure yet',
    };

    const htmlBody = `
      <h2>New Contact Form Submission</h2>
      <table style="border-collapse:collapse;width:100%;max-width:500px;">
        <tr><td style="padding:8px;font-weight:bold;color:#0B4C83;">Name</td><td style="padding:8px;">${name || '—'}</td></tr>
        <tr style="background:#f8fafc;"><td style="padding:8px;font-weight:bold;color:#0B4C83;">Email</td><td style="padding:8px;"><a href="mailto:${email}">${email}</a></td></tr>
        <tr><td style="padding:8px;font-weight:bold;color:#0B4C83;">Phone</td><td style="padding:8px;">${phone || '—'}</td></tr>
        <tr style="background:#f8fafc;"><td style="padding:8px;font-weight:bold;color:#0B4C83;">Practice</td><td style="padding:8px;">${practice || '—'}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;color:#0B4C83;">Website</td><td style="padding:8px;">${website || '—'}</td></tr>
        <tr style="background:#f8fafc;"><td style="padding:8px;font-weight:bold;color:#0B4C83;">Interested In</td><td style="padding:8px;">${interestLabel[interest] || interest || '—'}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;color:#0B4C83;">Message</td><td style="padding:8px;">${message || '—'}</td></tr>
      </table>
    `;

    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Vision Managers <notifications@visionmanagers.com>',
          to: NOTIFY_EMAIL,
          subject: `New Contact: ${name || email}`,
          html: htmlBody,
        }),
      });
    } catch (emailErr) {
      console.error('Email notification failed:', emailErr);
    }
  }

  return res.status(200).json({ success: true });
}
