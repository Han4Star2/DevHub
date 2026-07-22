import { and, asc, eq, gte, sql } from "drizzle-orm";
import { db } from "../client";
import { gameStatsSnapshots } from "../schema";

export type ChartRange = "24h" | "7d" | "30d" | "all";

const RANGE_TO_INTERVAL: Record<Exclude<ChartRange, "all">, string> = {
  "24h": "24 hours",
  "7d": "7 days",
  "30d": "30 days",
};

export interface StatsPoint {
  capturedAt: Date;
  ccu: number | null;
  visits: number | null;
  favorites: number | null;
  likes: number | null;
  dislikes: number | null;
  ratingPct: string | null;
  ccuMovingAvg: number | null;
}

export async function getSnapshotsForGame(
  gameId: string,
  range: ChartRange,
): Promise<StatsPoint[]> {
  const conditions = [eq(gameStatsSnapshots.gameId, gameId)];
  if (range !== "all") {
    conditions.push(
      gte(
        gameStatsSnapshots.capturedAt,
        sql`now() - ${sql.raw(`interval '${RANGE_TO_INTERVAL[range]}'`)}`,
      ),
    );
  }

  const rows = await db
    .select({
      capturedAt: gameStatsSnapshots.capturedAt,
      ccu: gameStatsSnapshots.ccu,
      visits: gameStatsSnapshots.visits,
      favorites: gameStatsSnapshots.favorites,
      likes: gameStatsSnapshots.likes,
      dislikes: gameStatsSnapshots.dislikes,
      ratingPct: gameStatsSnapshots.ratingPct,
      ccuMovingAvg: sql<number>`avg(${gameStatsSnapshots.ccu}) over (
        order by ${gameStatsSnapshots.capturedAt}
        rows between 6 preceding and current row
      )`,
    })
    .from(gameStatsSnapshots)
    .where(and(...conditions))
    .orderBy(asc(gameStatsSnapshots.capturedAt));

  return rows;
}

export interface GrowthMetric {
  current: number | null;
  past: number | null;
  deltaPct: number | null;
}

async function getDeltaSince(
  gameId: string,
  column: typeof gameStatsSnapshots.ccu | typeof gameStatsSnapshots.visits,
  hoursAgo: number,
): Promise<GrowthMetric> {
  const [latest] = await db
    .select({ value: column, capturedAt: gameStatsSnapshots.capturedAt })
    .from(gameStatsSnapshots)
    .where(eq(gameStatsSnapshots.gameId, gameId))
    .orderBy(sql`${gameStatsSnapshots.capturedAt} desc`)
    .limit(1);

  if (!latest) return { current: null, past: null, deltaPct: null };

  const [past] = await db
    .select({ value: column })
    .from(gameStatsSnapshots)
    .where(
      and(
        eq(gameStatsSnapshots.gameId, gameId),
        sql`${gameStatsSnapshots.capturedAt} <= now() - ${sql.raw(`interval '${hoursAgo} hours'`)}`,
      ),
    )
    .orderBy(sql`${gameStatsSnapshots.capturedAt} desc`)
    .limit(1);

  const current = latest.value ?? null;
  const pastValue = past?.value ?? null;
  const deltaPct =
    current !== null && pastValue !== null && pastValue !== 0
      ? ((current - pastValue) / pastValue) * 100
      : null;

  return { current, past: pastValue, deltaPct };
}

export async function getCcuGrowth(
  gameId: string,
  hoursAgo: number,
): Promise<GrowthMetric> {
  return getDeltaSince(gameId, gameStatsSnapshots.ccu, hoursAgo);
}

export async function getVisitsGrowth(
  gameId: string,
  hoursAgo: number,
): Promise<GrowthMetric> {
  return getDeltaSince(gameId, gameStatsSnapshots.visits, hoursAgo);
}
