-- Working memory per lead (business profile + everything learned across sessions)
-- and a Supabase-backed daily usage cap (25 model runs per lead per UTC day).
alter table lab_leads add column if not exists memory text;
alter table lab_leads add column if not exists memory_updated_at timestamptz;
alter table lab_leads add column if not exists daily_runs integer not null default 0;
alter table lab_leads add column if not exists runs_date date;

-- Returning visitors are matched by email (most recent lead row wins)
create index if not exists lab_leads_email_idx on lab_leads (email, created_at desc);
