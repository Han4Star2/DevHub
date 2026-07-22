import { and, eq, isNull, sql } from "drizzle-orm";
import { db } from "../client";
import { games, latestGameStats } from "../schema";

export async function getOwnedGames(userId: string) {
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
      visits: latestGameStats.visits,
      favorites: latestGameStats.favorites,
    })
    .from(games)
    .leftJoin(latestGameStats, eq(latestGameStats.gameId, games.id))
    .where(eq(games.ownerId, userId));
}

export async function getDashboardAggregate(userId: string) {
  const [row] = await db
    .select({
      gamesOwned: sql<number>`count(distinct ${games.id})`,
      totalCcu: sql<number>`coalesce(sum(${latestGameStats.ccu}), 0)`,
      totalVisits: sql<number>`coalesce(sum(${latestGameStats.visits}), 0)`,
    })
    .from(games)
    .leftJoin(latestGameStats, eq(latestGameStats.gameId, games.id))
    .where(eq(games.ownerId, userId));
  return row;
}

export type ClaimGameResult =
  | { ok: true }
  | { ok: false; reason: "not_found" | "already_claimed" };

/**
 * Self-service claim, no ownership verification — anyone can claim any
 * unclaimed tracked game. Acceptable for this MVP slice; a real
 * verification flow (e.g. Roblox OAuth confirming group/creator
 * membership) is out of scope for now.
 */
export async function claimGameByUniverseId(
  userId: string,
  universeId: number,
): Promise<ClaimGameResult> {
  const [game] = await db
    .select({ id: games.id, ownerId: games.ownerId })
    .from(games)
    .where(eq(games.universeId, universeId))
    .limit(1);

  if (!game) return { ok: false, reason: "not_found" };
  if (game.ownerId) return { ok: false, reason: "already_claimed" };

  await db
    .update(games)
    .set({ ownerId: userId, updatedAt: new Date() })
    .where(and(eq(games.id, game.id), isNull(games.ownerId)));

  return { ok: true };
}
