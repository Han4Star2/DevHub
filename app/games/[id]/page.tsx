import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGameBySlug, getLatestStatsForGame } from "@/lib/db/queries/games";
import {
  getCcuGrowth,
  getSnapshotsForGame,
  getVisitsGrowth,
  type ChartRange,
} from "@/lib/db/queries/stats";
import { Badge } from "@/components/ui/Badge";
import { StatSummaryCards } from "@/components/analytics/StatSummaryCards";
import { TimeRangeSelector } from "@/components/analytics/TimeRangeSelector";
import { StatChart } from "@/components/analytics/StatChart";

const VALID_RANGES: ChartRange[] = ["24h", "7d", "30d", "all"];

export default async function GameAnalyticsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ range?: string }>;
}) {
  const { id: slug } = await params;
  const { range: rawRange } = await searchParams;
  const range = VALID_RANGES.includes(rawRange as ChartRange)
    ? (rawRange as ChartRange)
    : "7d";

  const game = await getGameBySlug(slug);
  if (!game) notFound();

  const [latestStats, snapshots, ccuGrowth7d, visitsGrowth7d] =
    await Promise.all([
      getLatestStatsForGame(game.id),
      getSnapshotsForGame(game.id, range),
      getCcuGrowth(game.id, 24 * 7),
      getVisitsGrowth(game.id, 24 * 7),
    ]);

  const ccuData = snapshots.map((s) => ({
    capturedAt: s.capturedAt.toISOString(),
    value: s.ccu,
    movingAvg: s.ccuMovingAvg,
  }));
  const visitsData = snapshots.map((s) => ({
    capturedAt: s.capturedAt.toISOString(),
    value: s.visits,
  }));
  const favoritesData = snapshots.map((s) => ({
    capturedAt: s.capturedAt.toISOString(),
    value: s.favorites,
  }));
  const ratingData = snapshots.map((s) => ({
    capturedAt: s.capturedAt.toISOString(),
    value: s.ratingPct ? Number(s.ratingPct) : null,
  }));

  const likes = latestStats?.likes ?? 0;
  const dislikes = latestStats?.dislikes ?? 0;
  const likeRatio =
    likes + dislikes > 0 ? (likes / (likes + dislikes)) * 100 : null;

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Link href="/discover" className="text-sm text-white/50 hover:text-white">
        ← Back to Discover
      </Link>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-white/10">
          {game.thumbnailUrl && (
            <Image
              src={game.thumbnailUrl}
              alt={game.name}
              fill
              className="object-cover"
              sizes="80px"
            />
          )}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold">{game.name}</h1>
            {game.verified && <Badge variant="verified">Verified</Badge>}
          </div>
          <p className="text-white/50">
            {game.studioName ?? "Unknown studio"}
            {game.genre ? ` · ${game.genre}` : ""}
          </p>
          {game.description && (
            <p className="mt-1 max-w-2xl text-sm text-white/60">
              {game.description}
            </p>
          )}
        </div>
        <a
          href={`https://www.roblox.com/games/${game.rootPlaceId}`}
          target="_blank"
          rel="noreferrer"
          className="ml-auto flex-shrink-0 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
        >
          Play on Roblox ↗
        </a>
      </div>

      <div className="mt-8">
        <StatSummaryCards
          cards={[
            { label: "CCU now", value: latestStats?.ccu ?? null, deltaPct: ccuGrowth7d.deltaPct },
            { label: "Visits", value: latestStats?.visits ?? null, deltaPct: visitsGrowth7d.deltaPct },
            { label: "Favorites", value: latestStats?.favorites ?? null },
            { label: "Like ratio", value: likeRatio !== null ? `${likeRatio.toFixed(1)}%` : "—" },
          ]}
        />
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-lg font-medium">Growth</h2>
        <TimeRangeSelector current={range} />
      </div>

      <div className="mt-4 flex flex-col gap-6">
        <ChartCard title="Concurrent players (CCU)">
          <StatChart data={ccuData} color="#34d399" label="CCU" showMovingAvg />
        </ChartCard>
        <ChartCard title="Visits">
          <StatChart data={visitsData} color="#60a5fa" label="Visits" />
        </ChartCard>
        <ChartCard title="Favorites">
          <StatChart data={favoritesData} color="#f472b6" label="Favorites" />
        </ChartCard>
        <ChartCard title="Like ratio">
          <StatChart data={ratingData} color="#fbbf24" label="Like %" />
        </ChartCard>
      </div>
    </main>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <h3 className="mb-2 text-sm font-medium text-white/70">{title}</h3>
      {children}
    </div>
  );
}
