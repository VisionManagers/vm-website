-- Posts table for the Insights blog
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  summary text not null default '',
  content text not null default '',
  post_type text not null default 'Brief',
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  author_id uuid references auth.users(id),
  cta_icon text,
  cta_heading text,
  cta_body text,
  cta_button_text text,
  cta_button_link text,
  cta_style text default 'navy'
);

-- Index for public queries
create index if not exists idx_posts_published on posts (published, published_at desc);
create index if not exists idx_posts_slug on posts (slug);

-- RLS policies
alter table posts enable row level security;

-- Anyone can read published posts
create policy "Public can read published posts"
  on posts for select
  using (published = true);

-- Authenticated users can do everything
create policy "Authenticated users can manage posts"
  on posts for all
  to authenticated
  using (true)
  with check (true);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger posts_updated_at
  before update on posts
  for each row
  execute function update_updated_at();
