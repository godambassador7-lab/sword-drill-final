# SHARP Vector Search Setup

Optional upgrade for stronger semantic retrieval.

## 1) Run vector SQL

Run in Supabase SQL editor:

- `scripts/supabase/sharp_kb_vector.sql`

## 2) Configure front-end toggles

Add to `.env.local` and Vercel envs if needed:

```bash
REACT_APP_SHARP_USE_VECTOR=true
REACT_APP_SHARP_EMBEDDING_ENDPOINT=https://YOUR_EMBEDDING_ENDPOINT
REACT_APP_SHARP_DEBUG_CONFIDENCE=false
```

Notes:
- `REACT_APP_SHARP_EMBEDDING_ENDPOINT` should return `{ "embedding": [ ...1536 floats... ] }` for a posted `{ "query": "..." }`.
- Do not expose service-role keys in frontend envs.
- For fully free mode, keep premium fallback disabled and rely on local confidence gating.
