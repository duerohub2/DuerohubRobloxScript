# ScriptHub

Community-driven Roblox script catalog. Neo-brutalism UI, zero-login browsing.

## Stack

Next.js 14.2.x (App Router) · TypeScript 5.4.x (strict) · Tailwind CSS 3.4.x · Supabase (Postgres + Auth + Storage) · Vercel

## Setup

1. **Accounts** — GitHub, supabase.com, vercel.com (sign up with GitHub).
2. **Supabase project** — New Project → region Singapore → Settings → API → copy `Project URL`, `anon` key, `service_role` key.
3. **Database migration** — Supabase SQL Editor → paste `supabase/migrations/0001_init.sql` → Run. Verify 7 tables under `public` + 5 seeded categories.
4. **Local setup**:
   ```bash
   pnpm install
   cp .env.example .env.local   # fill in the 3 Supabase values + IP_HASH_SALT + NEXT_PUBLIC_SITE_URL
   pnpm dev
