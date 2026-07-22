# Core Vision (DevHub)

The professional platform for the Roblox economy. Built so far: **Landing**,
**Discover**, the flagship **Game Analytics** page (backed by real data
pulled from Roblox's public APIs), and **accounts + a personal Dashboard**.

## Stack

Next.js (App Router) + TypeScript, Postgres via Drizzle ORM, Tailwind CSS,
Recharts for charts.

## Getting started

1. Start Postgres locally:
   ```bash
   docker compose up -d
   ```
2. Copy the env file and adjust if needed:
   ```bash
   cp .env.example .env
   ```
3. Install dependencies and apply migrations:
   ```bash
   npm install
   npm run db:migrate
   ```
4. Seed a starter set of tracked games (resolves Roblox place IDs to
   universe IDs and pulls initial details):
   ```bash
   npm run seed
   ```
5. Pull a stats snapshot (run this repeatedly over time — e.g. every
   15-30 min via cron — to build up chart history):
   ```bash
   npm run ingest
   ```
6. Run the app:
   ```bash
   npm run dev
   ```

## Using Supabase for Postgres

Instead of local Docker Postgres, you can point this at a Supabase project:

1. Create a project at supabase.com.
2. In **Project Settings → Database → Connect**, copy both connection
   strings it gives you:
   - The **transaction pooler** URL (port `6543`, `?pgbouncer=true`) → set as
     `DATABASE_URL`. This is what the running app uses.
   - The **session pooler / direct** URL (port `5432`) → set as `DIRECT_URL`.
     Migrations need this — Supabase's transaction pooler doesn't support the
     session-level behavior `drizzle-kit` relies on.
3. Fill in the real password in your `.env` (never commit it or paste it into
   chat/logs — treat it like any other production secret).
4. Run `npm run db:migrate` — it uses `DIRECT_URL` when present.

## Data ingestion

`scripts/seed.ts` reads `scripts/starter-games.json` — a list of Roblox
**root place IDs** (the numeric ID in a game's `roblox.com/games/{id}/...`
URL) — resolves each to its `universeId`, and upserts a `games` row. Add
more games by appending `{ "placeId": <id> }` entries.

`scripts/ingest.ts` (and the `/api/cron/ingest` route, for deployment)
polls Roblox's public games/votes/thumbnails endpoints for all active
tracked games and writes a new row to `game_stats_snapshots`. Historical
growth charts and moving averages are computed from these snapshots — Roblox
itself only exposes current-point-in-time stats, so the time series is ours
to build.

In production, wire `/api/cron/ingest` (protected by `CRON_SECRET`) to a
scheduler — `vercel.json` already configures Vercel Cron to hit it every 30
minutes if deploying there.

## Database

- `games` — static/slow-changing game info (name, studio, genre, thumbnail,
  optional `owner_id` once claimed by a user).
- `game_stats_snapshots` — time-series CCU/visits/favorites/votes.
- `latest_game_stats` — a view exposing each game's most recent snapshot,
  used by Discover's and the Dashboard's sort/filter queries.
- `users` / `sessions` — email+password accounts with opaque, cookie-backed
  sessions (scrypt password hashing, no third-party auth provider).

Schema lives in `lib/db/schema.ts`; migrations are generated with
`npm run db:generate` and applied with `npm run db:migrate`.

## Accounts & Dashboard

Sign up / log in at `/signup` and `/login` (email + password, no email
verification yet). `/dashboard` is a protected page showing a user's claimed
games and combined CCU/visits. Claiming a game is currently **self-service**
by universe ID — any logged-in user can claim any unclaimed tracked game;
there's no ownership verification (e.g. confirming Roblox group/creator
membership) yet, which is a known gap to close before this goes further than
an MVP.

## Scope so far

In: Landing page, Discover (search/sort/filter), Game Analytics (CCU/visits/
favorites/like-ratio charts with moving averages and growth deltas), the
ingestion pipeline, accounts, and a personal Dashboard with self-service game
claiming.

Deliberately out for now: verified game ownership, developer/studio
profiles, marketplace, job board, watchlists, messaging, community, public
API, billing, admin panel, AI features, mobile app.
