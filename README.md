# Core Vision (DevHub)

The professional platform for the Roblox economy. Built so far: **Landing**,
**Discover**, the flagship **Game Analytics** page (backed by real data
pulled from Roblox's public APIs), **accounts + a personal Dashboard**, and
**public Developer Profiles**.

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
- `users` / `sessions` — email+password or Roblox-OAuth accounts (scrypt
  password hashing when applicable), opaque cookie-backed sessions, no
  third-party auth provider. `password_hash` is nullable for Roblox-only
  accounts; `roblox_user_id`/`roblox_username` are set when linked via
  Roblox.

Schema lives in `lib/db/schema.ts`; migrations are generated with
`npm run db:generate` and applied with `npm run db:migrate`.

## Accounts & Dashboard

Sign up / log in at `/signup` and `/login` — either email + password, or
**Sign in with Roblox**. `/dashboard` is a protected page showing a user's
claimed games and combined CCU/visits. Claiming a game is currently
**self-service** by universe ID — any logged-in user can claim any unclaimed
tracked game; there's no ownership verification (e.g. confirming Roblox
group/creator membership) yet, which is a known gap to close before this
goes further than an MVP.

## Roblox OAuth ("Sign in with Roblox")

Uses Roblox's standard OAuth 2.0 authorization-code flow with PKCE
(`lib/auth/roblox-oauth.ts`; routes at `/api/auth/roblox/start` and
`/api/auth/roblox/callback`). Roblox's `openid profile` scope doesn't include
email, so Roblox-authenticated accounts get a synthesized placeholder email
and a `null` password — they can only log back in through Roblox, not the
email/password form. First-time Roblox sign-in auto-generates a Core Vision
username from their Roblox display name (editable afterward in
`/settings/profile`).

**Setup (required before the button works — without it, it fails gracefully
with a "not set up yet" message instead of crashing):**

1. Go to `create.roblox.com` → your account → **Credentials/OAuth Apps**
   (under Open Cloud / API settings) and create a new OAuth app.
2. Set its redirect URL to `<your deployed domain>/api/auth/roblox/callback`
   exactly (must match what the app sends).
3. Set three env vars (locally in `.env`, and separately in your host's
   environment variables — e.g. Vercel project settings):
   - `APP_BASE_URL` — your deployed origin, e.g. `https://your-app.vercel.app`
     (no trailing slash). Used to build the exact redirect URI.
   - `ROBLOX_OAUTH_CLIENT_ID`
   - `ROBLOX_OAUTH_CLIENT_SECRET` — treat like a password, never commit it.

Note: this flow talks to `apis.roblox.com`, which couldn't be reached from
the sandbox this was built in (network policy), so the live token
exchange/userinfo calls are implemented against Roblox's documented OAuth
API shape but untested end-to-end — test the full round trip once you have
real credentials wired up, and report back if the token/userinfo response
shapes don't match what's expected.

## Developer Profiles

Every user gets a public profile at `/developers/[username]` (username is
required at signup, or set later at `/settings/profile`). It shows their bio,
skills, claimed games, combined/lifetime stats, and achievement badges.
Achievements are computed from real tracked data only — "1M+ Visits" and
"Top 100 by CCU" — not the "Featured Game" or "Innovation" badges from the
original vision doc, since those need editorial/admin curation this MVP
doesn't have.

## Scope so far

In: Landing page, Discover (search/sort/filter), Game Analytics (CCU/visits/
favorites/like-ratio charts with moving averages and growth deltas), the
ingestion pipeline, accounts, a personal Dashboard with self-service game
claiming, and public Developer Profiles with computed achievements.

Deliberately out for now: verified game ownership, studio profiles,
marketplace, job board, watchlists, messaging, community, public API,
billing, admin panel, AI features, mobile app.
