-- Run in the Supabase SQL Editor (after accounts.sql). One row per Account per day: ticked items and water.

create table public.logs (
  account_id uuid not null references public.accounts (id) on delete cascade,
  day text not null check (day ~ '^\d{4}-\d{2}-\d{2}$'),
  done text[] not null default '{}',
  water integer not null default 0 check (water >= 0),
  primary key (account_id, day)
);

alter table public.logs enable row level security;
create policy "own log read" on public.logs for select to authenticated using (account_id = auth.uid());
create policy "own log insert" on public.logs for insert to authenticated with check (account_id = auth.uid());
create policy "own log update" on public.logs for update to authenticated
  using (account_id = auth.uid()) with check (account_id = auth.uid());
create policy "own log delete" on public.logs for delete to authenticated using (account_id = auth.uid());
-- No anon access.
