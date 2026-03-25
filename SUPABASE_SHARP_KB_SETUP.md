# SHARP Knowledge Base (1GB-Free-Tier Target)

This setup fills Supabase with chunked biblical/app content for SHARP retrieval.

## 1) Run KB schema SQL in Supabase

In SQL Editor, run:

- `scripts/supabase/sharp_kb_schema.sql`

This creates `public.sharp_kb_chunks` and read policy for `anon`.

## 2) Set local ingestion env vars

Create/update `.env.local`:

```bash
REACT_APP_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

`SUPABASE_SERVICE_ROLE_KEY` is required only for ingestion (server-side script).
Do not expose it in client code or Vercel public env vars.

## 3) Ingest up to target size

Default target is 900 MB (safe under 1GB free tier):

```bash
npm run sharp:ingest
```

Custom target:

```bash
npm run sharp:ingest -- --target-mb=700
```

Reset and reload:

```bash
npm run sharp:ingest -- --reset --target-mb=900
```

Optional custom sources:

```bash
npm run sharp:ingest -- --sources=README.md,public/bibles,src/data --target-mb=900
```

## 4) Runtime usage

SHARP now performs:
- Local pipeline answer generation
- Supabase KB search (`sharp_kb_chunks`) for relevant snippets
- Inline "Library Notes" in responses when KB hits are found

