import { and, eq, gt, sql } from "drizzle-orm";
import { db } from "../client";
import { games, gameStatsSnapshots, latestGameStats, users } from "../schema";

export async function getPublicProfileByUsername(username: string) {
  const [user] = await db
    .select({
      id: users.id,
      username: users.username,
      name: users.name,
      bio: users.bio,
      skills: users.skills,
      avatarUrl: users.avatarUrl,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.username, username.toLowerCase()))
    .limit(1);
  return user;
}

export async function getProfileGames(userId: string) {
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
      createdAt: games.createdAt,
    })
    .from(games)
    .leftJoin(latestGameStats, eq(latestGameStats.gameId, games.id))
    .where(eq(games.ownerId, userId))
    .orderBy(games.createdAt);
}

export interface ProfileStats {
  gamesOwned: number;
  combinedCcu: number;
  combinedVisits: number;
  peakCcuEver: number | null;
}

export async function getProfileStats(userId: string): Promise<ProfileStats> {
  const [aggregate] = await db
    .select({
      gamesOwned: sql<number>`count(distinct ${games.id})`,
      combinedCcu: sql<number>`coalesce(sum(${latestGameStats.ccu}), 0)`,
      combinedVisits: sql<number>`coalesce(sum(${latestGameStats.visits}), 0)`,
    })
    .from(games)
    .leftJoin(latestGameStats, eq(latestGameStats.gameId, games.id))
    .where(eq(games.ownerId, userId));

  const [peak] = await db
    .select({ peakCcu: sql<number | null>`max(${gameStatsSnapshots.ccu})` })
    .from(gameStatsSnapshots)
    .innerJoin(games, eq(games.id, gameStatsSnapshots.gameId))
    .where(eq(games.ownerId, userId));

  return {
    gamesOwned: aggregate?.gamesOwned ?? 0,
    combinedCcu: aggregate?.combinedCcu ?? 0,
    combinedVisits: aggregate?.combinedVisits ?? 0,
    peakCcuEver: peak?.peakCcu ?? null,
  };
}

export interface Achievement {
  id: string;
  label: string;
  description: string;
}

/**
 * Achievements computed from real tracked data only. "Featured Game" and
 * "Innovation" badges from the original vision doc need editorial/admin
 * curation we don't have yet, so they're intentionally left out rather than
 * faked.
 */
export async function getProfileAchievements(
  userId: string,
): Promise<Achievement[]> {
  const achievements: Achievement[] = [];

  const [visitsRow] = await db
    .select({ maxVisits: sql<number>`coalesce(max(${latestGameStats.visits}), 0)` })
    .from(games)
    .leftJoin(latestGameStats, eq(latestGameStats.gameId, games.id))
    .where(eq(games.ownerId, userId));

  if ((visitsRow?.maxVisits ?? 0) >= 1_000_000) {
    achievements.push({
      id: "1m-visits",
      label: "1M+ Visits",
      description: "One of your games has passed 1,000,000 visits.",
    });
  }

  const [bestCcuRow] = await db
    .select({ bestCcu: sql<number | null>`max(${latestGameStats.ccu})` })
    .from(games)
    .leftJoin(latestGameStats, eq(latestGameStats.gameId, games.id))
    .where(eq(games.ownerId, userId));

  if (bestCcuRow?.bestCcu !== null && bestCcuRow?.bestCcu !== undefined) {
    const [rankRow] = await db
      .select({ count: sql<number>`count(*)` })
      .from(games)
      .innerJoin(latestGameStats, eq(latestGameStats.gameId, games.id))
      .where(
        and(eq(games.isActive, true), gt(latestGameStats.ccu, bestCcuRow.bestCcu)),
      );
    const rank = (rankRow?.count ?? 0) + 1;
    if (rank <= 100) {
      achievements.push({
        id: "top-100",
        label: "Top 100 by CCU",
        description: `Ranked #${rank} by live concurrent players.`,
      });
    }
  }

  return achievements;
}
