-- Applied to the live project on 2026-11-13. Kept here as the record.
-- 1. Neighbors can report that water has gone.
alter table public.reports drop constraint reports_kind_check;
alter table public.reports add constraint reports_kind_check
  check (kind = any (array['cleared'::text, 'needs_clearing'::text, 'water'::text, 'water_gone'::text]));

-- 2. Thanks: one per browser per report. Insert-only for the public; only counts are readable.
create table public.thanks (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  report_id uuid not null references public.reports(id) on delete cascade,
  device text not null check (device ~ '^[a-f0-9-]{36}$'),
  unique (report_id, device)
);
alter table public.thanks enable row level security;
create policy "public can thank" on public.thanks for insert to anon, authenticated with check (true);
revoke all on public.thanks from anon, authenticated;
grant insert (report_id, device) on public.thanks to anon, authenticated;
create function public.thanks_rate_guard() returns trigger
language plpgsql security definer set search_path to '' as $$
begin
  if (select count(*) from public.thanks where created_at > now() - interval '1 hour') >= 3000 then
    raise exception 'Too many thanks right now. Try again later.';
  end if;
  return new;
end $$;
create trigger thanks_rate_guard before insert on public.thanks
  for each row execute function public.thanks_rate_guard();
create view public.thanks_counts with (security_invoker = false) as
  select report_id, count(*)::int as n from public.thanks group by report_id;
revoke all on public.thanks_counts from anon, authenticated;
grant select on public.thanks_counts to anon, authenticated;

-- 3. Bug reports and ideas from the site. Insert-only for the public; nobody can read them back.
create table public.feedback (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  kind text not null check (kind = any (array['bug'::text, 'idea'::text])),
  body text not null check (char_length(body) between 3 and 1000),
  page text check (char_length(page) <= 40),
  status text not null default 'new' check (status = any (array['new'::text, 'filed'::text, 'dismissed'::text])),
  issue_number integer
);
alter table public.feedback enable row level security;
create policy "public can send feedback" on public.feedback for insert to anon, authenticated with check (true);
revoke all on public.feedback from anon, authenticated;
grant insert (kind, body, page) on public.feedback to anon, authenticated;
create function public.feedback_rate_guard() returns trigger
language plpgsql security definer set search_path to '' as $$
begin
  if (select count(*) from public.feedback where created_at > now() - interval '1 hour') >= 60 then
    raise exception 'Too many messages right now. Try again later.';
  end if;
  return new;
end $$;
create trigger feedback_rate_guard before insert on public.feedback
  for each row execute function public.feedback_rate_guard();
