-- Run in the Supabase SQL Editor. Also: Authentication > Providers > Email > turn OFF "Confirm email".

create table public.accounts (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null check (username ~ '^[a-z0-9_]{3,20}$'),
  email text not null
);
create unique index accounts_username_key on public.accounts (lower(username));

alter table public.accounts enable row level security;
create policy "own account" on public.accounts for select to authenticated using (id = auth.uid());
-- No insert/update/delete policies: rows are created only by the trigger below.

-- Account row is created in the same transaction as the auth user (atomic); a taken Username aborts sign-up.
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.accounts (id, username, email)
  values (new.id, lower(new.raw_user_meta_data ->> 'username'), new.email);
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Instant taken/free feedback. Database uniqueness stays the real guard.
create function public.username_available(u text) returns boolean
language sql stable security definer set search_path = '' as $$
  select not exists (select 1 from public.accounts where lower(username) = lower(u));
$$;

-- Sign-in: resolve one Username to its Email. Never lists Accounts.
create function public.email_for_username(u text) returns text
language sql stable security definer set search_path = '' as $$
  select email from public.accounts where lower(username) = lower(u);
$$;

revoke all on function public.username_available(text), public.email_for_username(text) from public;
grant execute on function public.username_available(text), public.email_for_username(text) to anon, authenticated;
