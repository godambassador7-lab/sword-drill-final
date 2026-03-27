-- SHARP KB index tuning for faster ILIKE and metadata filters
-- Run in Supabase SQL Editor.

create extension if not exists pg_trgm;

-- Speeds case-insensitive substring matches used by retrieval queries.
create index if not exists sharp_kb_chunks_content_trgm_idx
  on public.sharp_kb_chunks
  using gin (content gin_trgm_ops);

-- Helps source-path filtering and prefix scans.
create index if not exists sharp_kb_chunks_source_path_pattern_idx
  on public.sharp_kb_chunks (source_path text_pattern_ops);

-- Speeds metadata filters used for intent/topic/translation routing.
create index if not exists sharp_kb_chunks_meta_topic_idx
  on public.sharp_kb_chunks ((metadata->>'topic'));

create index if not exists sharp_kb_chunks_meta_translation_idx
  on public.sharp_kb_chunks ((metadata->>'translation'));

create index if not exists sharp_kb_chunks_meta_book_idx
  on public.sharp_kb_chunks ((metadata->>'book'));

-- Optional maintenance after large ingests.
analyze public.sharp_kb_chunks;
