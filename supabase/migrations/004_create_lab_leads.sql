-- Lab workbench: business context + email capture
create table if not exists lab_leads (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text not null,
  business_name text not null,
  industry text,
  city text,
  website text,
  goal text,
  created_at timestamptz not null default now()
);

create index if not exists idx_lab_leads_created on lab_leads (created_at desc);

-- One row per tool output (chat keeps a single row updated with the transcript)
create table if not exists lab_runs (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references lab_leads (id) on delete cascade,
  tool text not null,
  input jsonb,
  output text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_lab_runs_lead on lab_runs (lead_id, created_at desc);

-- RLS: all access goes through the service role in serverless functions
alter table lab_leads enable row level security;
alter table lab_runs enable row level security;

create policy "Authenticated users can read lab leads"
  on lab_leads for select
  to authenticated
  using (true);

create policy "Authenticated users can read lab runs"
  on lab_runs for select
  to authenticated
  using (true);
