begin;

create table public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default pg_catalog.now()
);

alter table public.admin_users enable row level security;
revoke all on table public.admin_users from public, anon, authenticated;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $function$
  select exists (
    select 1
    from public.admin_users as allowed_admin
    where allowed_admin.user_id = (select auth.uid())
  );
$function$;

revoke all on function public.is_admin() from public, anon, authenticated;
grant execute on function public.is_admin() to authenticated;

comment on table public.admin_users is
  'Trusted administrator allowlist. Provision accounts through the Supabase dashboard or trusted SQL only.';
comment on function public.is_admin() is
  'Returns whether the current authenticated user is in the trusted admin allowlist.';

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null check (char_length(btrim(name)) between 1 and 160),
  kind text not null check (char_length(btrim(kind)) between 1 and 120),
  description text not null check (char_length(btrim(description)) between 1 and 4000),
  stack text[] not null default array[]::text[],
  repo_url text check (repo_url is null or repo_url ~ '^https://[^[:space:]]+$'),
  demo_url text check (demo_url is null or demo_url ~ '^https://[^[:space:]]+$'),
  project_status text,
  visual text not null default 'default',
  mark text,
  sort_order integer not null default 0,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default pg_catalog.now(),
  updated_at timestamptz not null default pg_catalog.now(),
  constraint projects_published_at_required
    check (not is_published or published_at is not null)
);

create table public.skill_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (char_length(btrim(name)) between 1 and 120),
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default pg_catalog.now(),
  updated_at timestamptz not null default pg_catalog.now()
);

create table public.skills (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.skill_groups (id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 120),
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default pg_catalog.now(),
  updated_at timestamptz not null default pg_catalog.now(),
  constraint skills_group_name_unique unique (group_id, name)
);

create table public.experience (
  id uuid primary key default gen_random_uuid(),
  category text not null check (char_length(btrim(category)) between 1 and 120),
  title text not null check (char_length(btrim(title)) between 1 and 200),
  organization text,
  detail text,
  description text not null check (char_length(btrim(description)) between 1 and 4000),
  badge text,
  start_date date,
  end_date date,
  is_current boolean not null default false,
  sort_order integer not null default 0,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default pg_catalog.now(),
  updated_at timestamptz not null default pg_catalog.now(),
  constraint experience_dates_valid check (
    (start_date is null or end_date is null or end_date >= start_date)
    and (not is_current or end_date is null)
  ),
  constraint experience_published_at_required
    check (not is_published or published_at is not null)
);

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (char_length(btrim(title)) between 1 and 240),
  category text not null check (char_length(btrim(category)) between 1 and 120),
  summary text not null check (char_length(btrim(summary)) between 1 and 600),
  content_markdown text not null default '',
  cover_image_path text,
  status text not null default 'draft'
    check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  sort_order integer not null default 0,
  created_at timestamptz not null default pg_catalog.now(),
  updated_at timestamptz not null default pg_catalog.now(),
  constraint blog_posts_published_at_required
    check (status <> 'published' or published_at is not null)
);

create table public.profile_settings (
  singleton boolean primary key not null default true check (singleton),
  display_name text not null default 'WIZTECH'
    check (char_length(btrim(display_name)) between 1 and 120),
  headline text,
  bio text,
  public_email text,
  location text,
  github_url text check (github_url is null or github_url ~ '^https://[^[:space:]]+$'),
  linkedin_url text check (linkedin_url is null or linkedin_url ~ '^https://[^[:space:]]+$'),
  avatar_path text,
  updated_at timestamptz not null default pg_catalog.now(),
  created_at timestamptz not null default pg_catalog.now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $function$
begin
  new.updated_at = pg_catalog.now();
  return new;
end;
$function$;

create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();
create trigger skill_groups_set_updated_at
  before update on public.skill_groups
  for each row execute function public.set_updated_at();
create trigger skills_set_updated_at
  before update on public.skills
  for each row execute function public.set_updated_at();
create trigger experience_set_updated_at
  before update on public.experience
  for each row execute function public.set_updated_at();
create trigger blog_posts_set_updated_at
  before update on public.blog_posts
  for each row execute function public.set_updated_at();
create trigger profile_settings_set_updated_at
  before update on public.profile_settings
  for each row execute function public.set_updated_at();

create index projects_public_order_idx
  on public.projects (sort_order, created_at)
  where is_published;
create index skill_groups_public_order_idx
  on public.skill_groups (sort_order)
  where is_published;
create index skills_group_order_idx
  on public.skills (group_id, sort_order);
create index experience_public_order_idx
  on public.experience (sort_order, start_date desc)
  where is_published;
create index blog_posts_public_order_idx
  on public.blog_posts (published_at desc, sort_order)
  where status = 'published';

alter table public.projects enable row level security;
alter table public.skill_groups enable row level security;
alter table public.skills enable row level security;
alter table public.experience enable row level security;
alter table public.blog_posts enable row level security;
alter table public.profile_settings enable row level security;

revoke all on table
  public.projects,
  public.skill_groups,
  public.skills,
  public.experience,
  public.blog_posts,
  public.profile_settings
from public, anon, authenticated;

grant select on table
  public.projects,
  public.skill_groups,
  public.skills,
  public.experience,
  public.blog_posts,
  public.profile_settings
to anon, authenticated;

grant insert, update, delete on table
  public.projects,
  public.skill_groups,
  public.skills,
  public.experience,
  public.blog_posts,
  public.profile_settings
to authenticated;

create policy projects_read_published
  on public.projects for select to anon, authenticated
  using (is_published and published_at <= pg_catalog.now());
create policy projects_admin_manage
  on public.projects for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy skill_groups_read_published
  on public.skill_groups for select to anon, authenticated
  using (is_published);
create policy skill_groups_admin_manage
  on public.skill_groups for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy skills_read_published
  on public.skills for select to anon, authenticated
  using (
    is_published
    and exists (
      select 1
      from public.skill_groups as published_group
      where published_group.id = public.skills.group_id
        and published_group.is_published
    )
  );
create policy skills_admin_manage
  on public.skills for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy experience_read_published
  on public.experience for select to anon, authenticated
  using (is_published and published_at <= pg_catalog.now());
create policy experience_admin_manage
  on public.experience for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy blog_posts_read_published
  on public.blog_posts for select to anon, authenticated
  using (status = 'published' and published_at <= pg_catalog.now());
create policy blog_posts_admin_manage
  on public.blog_posts for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy profile_settings_read_public
  on public.profile_settings for select to anon, authenticated
  using (singleton);
create policy profile_settings_admin_manage
  on public.profile_settings for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

commit;
