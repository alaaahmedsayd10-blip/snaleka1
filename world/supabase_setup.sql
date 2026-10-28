-- Run this in Supabase Dashboard > SQL Editor before testing profile saving.
-- Auth passwords are managed by Supabase Auth and are never stored in this table.
create table if not exists public.players (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  username text not null default 'لاعب',
  updated_at timestamptz not null default now()
);

alter table public.players enable row level security;

-- A signed-in player may read only their own profile.
drop policy if exists "players_select_own" on public.players;
create policy "players_select_own" on public.players
  for select to authenticated using (auth.uid() = id);

-- A signed-in player may insert only a profile whose ID matches their auth user.
drop policy if exists "players_insert_own" on public.players;
create policy "players_insert_own" on public.players
  for insert to authenticated with check (auth.uid() = id);

-- A signed-in player may update only their own profile.
drop policy if exists "players_update_own" on public.players;
create policy "players_update_own" on public.players
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
