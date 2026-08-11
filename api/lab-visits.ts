import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { sendVisitSummary } from './_lib/visit-summary.js';

/* Idle-visit sweeper (cron, every 10 min): a lead whose last activity was
   15+ minutes ago and hasn't had this visit summarized gets the one
   consolidated email. The page-close beacon handles most visits; this
   catches closed laptops, dead tabs, and killed connections. */

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const auth = req.headers['authorization'];
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !RESEND_API_KEY) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  const idleCutoff = new Date(Date.now() - 15 * 60 * 1000).toISOString();

  const { data: leads, error } = await supabase
    .from('lab_leads')
    .select('*')
    .not('last_activity_at', 'is', null)
    .lt('last_activity_at', idleCutoff)
    .order('last_activity_at', { ascending: false })
    .limit(25);

  if (error) {
    // Column may not exist until migration 007 runs — fail quietly
    console.error('Visit sweep query failed:', error);
    return res.status(200).json({ swept: 0, note: 'query failed (migration pending?)' });
  }

  let sent = 0;
  for (const lead of leads || []) {
    const lastActivity = new Date(lead.last_activity_at).getTime();
    const notified = lead.visit_notified_at ? new Date(lead.visit_notified_at).getTime() : 0;
    if (lastActivity <= notified) continue; // visit already summarized

    const since = new Date(lastActivity - 12 * 3600 * 1000).toISOString();
    try {
      const ok = await sendVisitSummary(supabase, RESEND_API_KEY, lead, since);
      await supabase.from('lab_leads')
        .update({ visit_notified_at: new Date().toISOString() })
        .eq('id', lead.id);
      if (ok) sent++;
    } catch (err) {
      console.error(`Visit summary for ${lead.id} failed:`, err);
    }
  }

  return res.status(200).json({ swept: (leads || []).length, sent });
}
