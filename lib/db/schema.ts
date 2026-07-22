import {
  bigint,
  bigserial,
  boolean,
  index,
  numeric,
  pgTable,
  pgView,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const games = pgTable(
  "games",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    universeId: bigint("universe_id", { mode: "number" }).notNull(),
    rootPlaceId: bigint("root_place_id", { mode: "number" }).notNull(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    studioName: text("studio_name"),
    studioId: bigint("studio_id", { mode: "number" }),
    description: text("description"),
    genre: text("genre"),
    thumbnailUrl: text("thumbnail_url"),
    iconUrl: text("icon_url"),
    verified: boolean("verified").notNull().default(false),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("games_universe_id_idx").on(table.universeId),
    uniqueIndex("games_slug_idx").on(table.slug),
    index("games_genre_idx").on(table.genre),
    index("games_is_active_idx").on(table.isActive),
  ],
);

export const gameStatsSnapshots = pgTable(
  "game_stats_snapshots",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    gameId: uuid("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    ccu: bigint("ccu", { mode: "number" }),
    visits: bigint("visits", { mode: "number" }),
    favorites: bigint("favorites", { mode: "number" }),
    likes: bigint("likes", { mode: "number" }),
    dislikes: bigint("dislikes", { mode: "number" }),
    ratingPct: numeric("rating_pct", { precision: 5, scale: 2 }),
    capturedAt: timestamp("captured_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("game_stats_snapshots_game_captured_idx").on(
      table.gameId,
      table.capturedAt,
    ),
  ],
);

/**
 * Backed by a hand-written migration (drizzle/migrations/0001_latest_game_stats_view.sql)
 * rather than Drizzle-generated DDL — `.existing()` tells drizzle-kit not to
 * try to manage this view's schema itself.
 */
export const latestGameStats = pgView("latest_game_stats", {
  id: bigserial("id", { mode: "number" }),
  gameId: uuid("game_id"),
  ccu: bigint("ccu", { mode: "number" }),
  visits: bigint("visits", { mode: "number" }),
  favorites: bigint("favorites", { mode: "number" }),
  likes: bigint("likes", { mode: "number" }),
  dislikes: bigint("dislikes", { mode: "number" }),
  ratingPct: numeric("rating_pct", { precision: 5, scale: 2 }),
  capturedAt: timestamp("captured_at", { withTimezone: true }),
}).existing();

export type Game = typeof games.$inferSelect;
export type NewGame = typeof games.$inferInsert;
export type GameStatsSnapshot = typeof gameStatsSnapshots.$inferSelect;
export type NewGameStatsSnapshot = typeof gameStatsSnapshots.$inferInsert;
