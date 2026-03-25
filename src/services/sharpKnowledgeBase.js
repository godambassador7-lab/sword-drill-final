import { isSupabaseConfigured, supabase } from './supabaseClient';

const KB_TABLE = 'sharp_kb_chunks';
const USE_VECTOR = process.env.REACT_APP_SHARP_USE_VECTOR === 'true';
const EMBEDDING_ENDPOINT = process.env.REACT_APP_SHARP_EMBEDDING_ENDPOINT;
const STOP_WORDS = new Set([
  'the', 'and', 'for', 'that', 'with', 'from', 'what', 'when', 'where', 'which',
  'into', 'your', 'about', 'this', 'have', 'will', 'would', 'there', 'their',
  'please', 'could', 'should', 'them', 'they', 'were', 'been', 'then', 'than'
]);

function tokenize(input) {
  return (input || '')
    .toLowerCase()
    .split(/[^a-z0-9]+/g)
    .filter((t) => t.length > 2 && !STOP_WORDS.has(t));
}

function scoreHit(query, content, title) {
  const q = (query || '').toLowerCase();
  const c = (content || '').toLowerCase();
  const t = (title || '').toLowerCase();
  if (!c) return 0;

  let score = 0;
  if (c.includes(q)) score += 8;
  if (t.includes(q)) score += 4;

  const tokens = tokenize(query);
  for (const token of tokens) {
    if (c.includes(token)) score += 1.2;
    if (t.includes(token)) score += 0.6;
  }

  return score;
}

function buildOrFilter(tokens) {
  const escaped = tokens
    .slice(0, 6)
    .map((t) => t.replace(/[%_,]/g, ''))
    .filter(Boolean);
  if (!escaped.length) return null;
  return escaped.map((t) => `content.ilike.%${t}%`).join(',');
}

function snippet(content, max = 240) {
  if (!content) return '';
  const clean = content.replace(/\s+/g, ' ').trim();
  return clean.length > max ? `${clean.slice(0, max)}...` : clean;
}

export async function searchSharpKnowledge(query, limit = 4) {
  if (!isSupabaseConfigured || !supabase || !query?.trim()) {
    return [];
  }

  if (USE_VECTOR && EMBEDDING_ENDPOINT) {
    const vectorHits = await searchSharpKnowledgeVector(query, limit);
    if (vectorHits.length > 0) return vectorHits;
  }

  const tokens = tokenize(query);
  const orFilter = buildOrFilter(tokens);

  let request = supabase
    .from(KB_TABLE)
    .select('source_path, title, chunk_index, content, metadata')
    .limit(60);

  if (orFilter) {
    request = request.or(orFilter);
  } else {
    request = request.ilike('content', `%${query.trim()}%`);
  }

  const { data, error } = await request;
  if (error || !Array.isArray(data)) {
    return [];
  }

  return data
    .map((row) => ({
      ...row,
      score: scoreHit(query, row.content, row.title),
      preview: snippet(row.content)
    }))
    .filter((row) => row.score > 0.5)
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.max(1, limit));
}

async function getQueryEmbedding(query) {
  if (!EMBEDDING_ENDPOINT) return null;
  try {
    const response = await fetch(EMBEDDING_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    if (!response.ok) return null;
    const json = await response.json();
    return Array.isArray(json?.embedding) ? json.embedding : null;
  } catch {
    return null;
  }
}

export async function searchSharpKnowledgeVector(query, limit = 4) {
  if (!isSupabaseConfigured || !supabase || !query?.trim()) return [];

  const embedding = await getQueryEmbedding(query);
  if (!embedding) return [];

  const { data, error } = await supabase.rpc('match_sharp_kb_chunks', {
    query_embedding: embedding,
    match_count: Math.max(1, limit),
    min_similarity: 0.72
  });

  if (error || !Array.isArray(data)) return [];

  return data.map((row) => ({
    source_path: row.source_path,
    title: row.title,
    chunk_index: row.chunk_index,
    content: row.content,
    score: Number(row.similarity) || 0,
    preview: snippet(row.content)
  }));
}
