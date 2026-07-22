import Link from "next/link";
import { GameCard, type GameCardData } from "../discover/GameCard";

export function ShowcaseGrid({ games }: { games: GameCardData[] }) {
  if (games.length === 0) return null;

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-medium">Trending right now</h2>
        <Link href="/discover" className="text-sm text-white/50 hover:text-white">
          View all →
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {games.map((game) => (
          <GameCard key={game.slug} game={game} view="grid" />
        ))}
      </div>
    </section>
  );
}
