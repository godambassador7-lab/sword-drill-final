create extension if not exists pgcrypto;

create table if not exists public.sharp_kb_chunks (
  id uuid primary key default gen_random_uuid(),
  source_path text not null,
  title text not null,
  chunk_index integer not null,
  content text not null,
  content_length integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create unique index if not exists sharp_kb_chunks_source_chunk_idx
  on public.sharp_kb_chunks (source_path, chunk_index);

create index if not exists sharp_kb_chunks_title_idx
  on public.sharp_kb_chunks (title);

create index if not exists sharp_kb_chunks_content_len_idx
  on public.sharp_kb_chunks (content_length);

alter table public.sharp_kb_chunks enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'sharp_kb_chunks'
      and policyname = 'Allow anon read sharp kb chunks'
  ) then
    create policy "Allow anon read sharp kb chunks"
      on public.sharp_kb_chunks
      for select
      to anon
      using (true);
  end if;
end $$;

