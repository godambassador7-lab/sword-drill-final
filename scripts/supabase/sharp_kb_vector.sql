create extension if not exists vector;

alter table public.sharp_kb_chunks
  add column if not exists embedding vector(1536);

create index if not exists sharp_kb_chunks_embedding_ivfflat_idx
  on public.sharp_kb_chunks
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

create or replace function public.match_sharp_kb_chunks(
  query_embedding vector(1536),
  match_count int default 5,
  min_similarity float default 0.72
)
returns table (
  id uuid,
  source_path text,
  title text,
  chunk_index integer,
  content text,
  similarity float
)
language sql
stable
as $$
  select
    c.id,
    c.source_path,
    c.title,
    c.chunk_index,
    c.content,
    1 - (c.embedding <=> query_embedding) as similarity
  from public.sharp_kb_chunks c
  where c.embedding is not null
    and (1 - (c.embedding <=> query_embedding)) >= min_similarity
  order by c.embedding <=> query_embedding
  limit greatest(match_count, 1);
$$;

grant execute on function public.match_sharp_kb_chunks(vector, int, float) to anon, authenticated, service_role;

