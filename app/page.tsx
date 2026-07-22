import {
  getLandingAggregateStats,
  getLandingShowcaseGames,
} from "@/lib/db/queries/games";

// Revalidate periodically so live stats and the showcase don't go stale
// between builds — ingestion runs every 15-30 min, so 5 min is plenty fresh.
export const revalidate = 300;
import { Hero } from "@/components/landing/Hero";
import { LiveStats } from "@/components/landing/LiveStats";
import { ValueProps } from "@/components/landing/ValueProps";
import { ShowcaseGrid } from "@/components/landing/ShowcaseGrid";
import { Footer } from "@/components/landing/Footer";

export default async function Home() {
  const [aggregate, showcaseGames] = await Promise.all([
    getLandingAggregateStats(),
    getLandingShowcaseGames(6),
  ]);

  return (
    <div className="flex flex-1 flex-col">
      <Hero />
      <LiveStats
        gamesTracked={aggregate?.gamesTracked ?? 0}
        totalCcu={aggregate?.totalCcu ?? 0}
      />
      <ValueProps />
      <ShowcaseGrid games={showcaseGames} />
      <Footer />
    </div>
  );
}
