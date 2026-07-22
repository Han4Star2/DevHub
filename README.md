# Core Vision (DevHub)

The professional platform for the Roblox economy. This is the first build
slice: **Landing**, **Discover**, and the flagship **Game Analytics** page,
backed by real data pulled from Roblox's public APIs.

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

- `games` — static/slow-changing game info (name, studio, genre, thumbnail).
- `game_stats_snapshots` — time-series CCU/visits/favorites/votes.
- `latest_game_stats` — a view exposing each game's most recent snapshot,
  used by Discover's sort/filter queries.

Schema lives in `lib/db/schema.ts`; migrations are generated with
`npm run db:generate` and applied with `npm run db:migrate`.

## Scope of this slice

In: Landing page, Discover (search/sort/filter), Game Analytics (CCU/visits/
favorites/like-ratio charts with moving averages and growth deltas), the
ingestion pipeline.

Deliberately out for now: accounts/auth, dashboards, developer/studio
profiles, marketplace, job board, watchlists, messaging, community, public
API, billing, admin panel, AI features, mobile app.
