import Link from "next/link";
import {
  getDiscoverGenres,
  listDiscoverGames,
  type DiscoverSort,
} from "@/lib/db/queries/games";
import { GameCard } from "@/components/discover/GameCard";
import { DiscoverControls } from "@/components/discover/DiscoverControls";
import { EmptyState } from "@/components/ui/EmptyState";

const PAGE_SIZE = 24;
const VALID_SORTS: DiscoverSort[] = [
  "top-ccu",
  "trending",
  "newest",
  "most-visits",
];

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    genre?: string;
    sort?: string;
    view?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const view = params.view === "list" ? "list" : "grid";
  const sort = VALID_SORTS.includes(params.sort as DiscoverSort)
    ? (params.sort as DiscoverSort)
    : "top-ccu";
  const page = Math.max(1, Number(params.page) || 1);

  const [games, genres] = await Promise.all([
    listDiscoverGames({
      search: params.q,
      genre: params.genre,
      sort,
      page,
      pageSize: PAGE_SIZE,
    }),
    getDiscoverGenres(),
  ]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Discover</h1>
        <p className="text-white/50">
          Browse and track Roblox games by growth, CCU, and visits.
        </p>
      </div>

      <div className="mb-6">
        <DiscoverControls genres={genres} view={view} />
      </div>

      {games.length === 0 ? (
        <EmptyState
          title="No games found"
          description="Try a different search term, genre, or check back after the next data ingestion run."
        />
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {games.map((game) => (
            <GameCard key={game.id} game={game} view="grid" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {games.map((game) => (
            <GameCard key={game.id} game={game} view="list" />
          ))}
        </div>
      )}

      {games.length === PAGE_SIZE && (
        <div className="mt-8 flex justify-center">
          <Link
            href={`/discover?${new URLSearchParams({ ...params, page: String(page + 1) } as Record<string, string>).toString()}`}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
          >
            Load more
          </Link>
        </div>
      )}
    </main>
  );
}
