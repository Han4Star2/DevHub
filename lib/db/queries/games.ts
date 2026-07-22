import { and, desc, eq, ilike, isNotNull, sql } from "drizzle-orm";
import { db } from "../client";
import { games, latestGameStats } from "../schema";

export async function getActiveGames() {
  return db.select().from(games).where(eq(games.isActive, true));
}

export async function updateGameFields(
  gameId: string,
  fields: Partial<{
    name: string;
    rootPlaceId: number;
    studioName: string | null;
    studioId: number | null;
    description: string | null;
    genre: string | null;
    thumbnailUrl: string | null;
    verified: boolean;
  }>,
) {
  await db
    .update(games)
    .set({ ...fields, updatedAt: new Date() })
    .where(eq(games.id, gameId));
}

export type DiscoverSort = "top-ccu" | "trending" | "newest" | "most-visits";

export interface DiscoverFilters {
  search?: string;
  genre?: string;
  sort?: DiscoverSort;
  page?: number;
  pageSize?: number;
}

const trendingDelta = sql<number>`(
  ${latestGameStats.ccu} - COALESCE((
    SELECT s.ccu FROM game_stats_snapshots s
    WHERE s.game_id = ${games.id} AND s.captured_at <= now() - interval '24 hours'
    ORDER BY s.captured_at DESC
    LIMIT 1
  ), ${latestGameStats.ccu})
)`;

export async function listDiscoverGames(filters: DiscoverFilters = {}) {
  const { search, genre, sort = "top-ccu", page = 1, pageSize = 24 } = filters;

  const conditions = [eq(games.isActive, true)];
  if (search) {
    conditions.push(ilike(games.name, `%${search}%`));
  }
  if (genre) {
    conditions.push(eq(games.genre, genre));
  }

  const orderBy = {
    "top-ccu": desc(latestGameStats.ccu),
    "most-visits": desc(latestGameStats.visits),
    newest: desc(games.createdAt),
    trending: desc(trendingDelta),
  }[sort];

  const rows = await db
    .select({
      id: games.id,
      slug: games.slug,
      name: games.name,
      studioName: games.studioName,
      genre: games.genre,
      thumbnailUrl: games.thumbnailUrl,
      verified: games.verified,
      ccu: latestGameStats.ccu,
      visits: latestGameStats.visits,
      favorites: latestGameStats.favorites,
      trendingDelta,
    })
    .from(games)
    .innerJoin(latestGameStats, eq(latestGameStats.gameId, games.id))
    .where(and(...conditions))
    .orderBy(orderBy)
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  return rows;
}

export async function getDiscoverGenres() {
  const rows = await db
    .selectDistinct({ genre: games.genre })
    .from(games)
    .where(and(eq(games.isActive, true), isNotNull(games.genre)));
  return rows.map((r) => r.genre).filter((g): g is string => !!g).sort();
}

export async function getGameBySlug(slug: string) {
  const rows = await db
    .select()
    .from(games)
    .where(eq(games.slug, slug))
    .limit(1);
  return rows[0];
}

export async function getLatestStatsForGame(gameId: string) {
  const rows = await db
    .select()
    .from(latestGameStats)
    .where(eq(latestGameStats.gameId, gameId))
    .limit(1);
  return rows[0];
}

export async function getLandingShowcaseGames(limit = 6) {
  return db
    .select({
      id: games.id,
      slug: games.slug,
      name: games.name,
      studioName: games.studioName,
      genre: games.genre,
      thumbnailUrl: games.thumbnailUrl,
      verified: games.verified,
      ccu: latestGameStats.ccu,
    })
    .from(games)
    .innerJoin(latestGameStats, eq(latestGameStats.gameId, games.id))
    .where(eq(games.isActive, true))
    .orderBy(desc(latestGameStats.ccu))
    .limit(limit);
}

export async function getLandingAggregateStats() {
  const [row] = await db
    .select({
      gamesTracked: sql<number>`count(distinct ${games.id})`,
      totalCcu: sql<number>`coalesce(sum(${latestGameStats.ccu}), 0)`,
    })
    .from(games)
    .innerJoin(latestGameStats, eq(latestGameStats.gameId, games.id))
    .where(eq(games.isActive, true));
  return row;
}
