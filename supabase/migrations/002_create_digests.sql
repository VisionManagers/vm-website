-- Stores the latest generated digest so it persists on the page
create table if not exists digests (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  generated_at timestamptz not null default now()
);

-- RLS: anyone can read, only server (service role) writes
alter table digests enable row level security;

create policy "Public can read digests"
  on digests for select
  using (true);
