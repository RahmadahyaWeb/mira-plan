-- Run in the Supabase SQL Editor (after accounts.sql). One row per Account: Profile and Plan as documents.

create table public.plans (
  account_id uuid primary key references public.accounts (id) on delete cascade,
  profile jsonb,
  plan jsonb,
  updated_at timestamptz not null default now()
);

alter table public.plans enable row level security;
create policy "own plan read" on public.plans for select to authenticated using (account_id = auth.uid());
create policy "own plan insert" on public.plans for insert to authenticated with check (account_id = auth.uid());
create policy "own plan update" on public.plans for update to authenticated
  using (account_id = auth.uid()) with check (account_id = auth.uid());
-- No delete policy, no anon access.
