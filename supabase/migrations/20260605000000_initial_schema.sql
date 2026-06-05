-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ==========================================
-- 1. Organizations & Users
-- ==========================================

create table public.organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  github_username text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.organization_members (
  org_id uuid references public.organizations(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'member')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (org_id, user_id)
);

-- ==========================================
-- 2. Repositories & Pull Requests
-- ==========================================

create table public.repositories (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid references public.organizations(id) on delete cascade not null,
  name text not null,
  external_id text unique, -- GitHub Repo ID
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.pull_requests (
  id uuid primary key default uuid_generate_v4(),
  repo_id uuid references public.repositories(id) on delete cascade not null,
  number integer not null, -- PR number from GitHub
  title text not null,
  state text not null check (state in ('open', 'closed', 'merged')),
  source_branch text not null,
  target_branch text not null,
  author_id uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(repo_id, number)
);

-- ==========================================
-- 3. Reviews & Checklists
-- ==========================================

create table public.reviews (
  id uuid primary key default uuid_generate_v4(),
  pr_id uuid references public.pull_requests(id) on delete cascade not null,
  reviewer_id uuid references public.profiles(id) on delete cascade not null,
  status text not null check (status in ('pending', 'commented', 'changes_requested', 'approved')),
  submitted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(pr_id, reviewer_id)
);

create table public.checklists (
  id uuid primary key default uuid_generate_v4(),
  pr_id uuid references public.pull_requests(id) on delete cascade not null,
  rule_name text not null,
  items jsonb not null default '[]'::jsonb, -- Array of {text: string, checked: bool}
  completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================
-- 4. Comments
-- ==========================================

create table public.comment_threads (
  id uuid primary key default uuid_generate_v4(),
  pr_id uuid references public.pull_requests(id) on delete cascade not null,
  file_path text not null,
  line_number integer not null,
  side text check (side in ('left', 'right')),
  resolved boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.comments (
  id uuid primary key default uuid_generate_v4(),
  thread_id uuid references public.comment_threads(id) on delete cascade not null,
  author_id uuid references public.profiles(id) on delete cascade not null,
  body text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================
-- Row Level Security (RLS)
-- ==========================================

alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.organization_members enable row level security;
alter table public.repositories enable row level security;
alter table public.pull_requests enable row level security;
alter table public.reviews enable row level security;
alter table public.checklists enable row level security;
alter table public.comment_threads enable row level security;
alter table public.comments enable row level security;

-- Basic RLS: Users can see their own profile
create policy "Users can view their own profile" 
  on public.profiles for select 
  using (auth.uid() = id);

create policy "Users can update their own profile" 
  on public.profiles for update 
  using (auth.uid() = id);

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
