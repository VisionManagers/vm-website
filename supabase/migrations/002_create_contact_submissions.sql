-- Contact form submissions
create table if not exists contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text not null,
  phone text,
  practice text,
  website text,
  interest text,
  message text,
  created_at timestamptz not null default now()
);

-- Index for viewing recent submissions
create index if not exists idx_contact_created on contact_submissions (created_at desc);

-- RLS policies
alter table contact_submissions enable row level security;

-- Anyone can insert (public form)
create policy "Public can submit contact form"
  on contact_submissions for insert
  with check (true);

-- Only authenticated users can read submissions
create policy "Authenticated users can read submissions"
  on contact_submissions for select
  to authenticated
  using (true);
