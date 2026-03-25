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
REACT_APP_SHARP_ENABLE_LLM_FALLBACK=true
REACT_APP_ENABLE_CLAUDE=true
REACT_APP_ANTHROPIC_API_KEY=YOUR_CLAUDE_API_KEY
```

Notes:
- `REACT_APP_SHARP_EMBEDDING_ENDPOINT` should return `{ "embedding": [ ...1536 floats... ] }` for a posted `{ "query": "..." }`.
- Do not expose service-role keys in frontend envs.
- Claude fallback is optional and only used when local retrieval confidence is low.

