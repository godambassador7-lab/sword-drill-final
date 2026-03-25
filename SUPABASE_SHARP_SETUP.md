# Supabase Setup for SHARP Assistant

This project now supports optional SHARP conversation persistence to Supabase.

## 1) Add environment variables

Create or update `.env.local`:

```bash
REACT_APP_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
REACT_APP_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

Restart the dev server after adding these variables.

## 2) Create the SHARP messages table

Run this in Supabase SQL Editor:

```sql
create extension if not exists pgcrypto;

create table if not exists public.sharp_assistant_messages (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  session_id text not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  citations jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists sharp_assistant_messages_user_created_idx
  on public.sharp_assistant_messages (user_id, created_at desc);
```

## 3) Enable RLS and add policies

Because this app currently uses Firebase auth, these policies use the `anon` role.
For production-grade security, move writes behind a trusted backend that verifies identity.

```sql
alter table public.sharp_assistant_messages enable row level security;

create policy "Allow anon read sharp messages"
on public.sharp_assistant_messages
for select
to anon
using (true);

create policy "Allow anon insert sharp messages"
on public.sharp_assistant_messages
for insert
to anon
with check (true);
```

## 4) What the app does now

- Loads up to the latest 30 SHARP messages for the logged-in Firebase user.
- Saves each new user/assistant turn to Supabase.
- Falls back silently when Supabase is not configured.

