import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/Badge";
import { formatCompactNumber } from "@/lib/utils/format";

export interface GameCardData {
  slug: string;
  name: string;
  studioName: string | null;
  genre: string | null;
  thumbnailUrl: string | null;
  verified: boolean;
  ccu: number | null;
}

export function GameCard({
  game,
  view = "grid",
}: {
  game: GameCardData;
  view?: "grid" | "list";
}) {
  if (view === "list") {
    return (
      <Link
        href={`/games/${game.slug}`}
        className="flex items-center gap-4 rounded-lg border border-white/10 bg-white/[0.03] p-3 transition hover:border-white/20 hover:bg-white/[0.06]"
      >
        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-md bg-white/10">
          {game.thumbnailUrl && (
            <Image
              src={game.thumbnailUrl}
              alt={game.name}
              fill
              className="object-cover"
              sizes="56px"
            />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate font-medium">{game.name}</p>
            {game.verified && <Badge variant="verified">✓</Badge>}
          </div>
          <p className="truncate text-sm text-white/50">
            {game.studioName ?? "Unknown studio"}
            {game.genre ? ` · ${game.genre}` : ""}
          </p>
        </div>
        <div className="flex-shrink-0 text-right">
          <p className="font-mono text-sm font-medium text-emerald-400">
            {formatCompactNumber(game.ccu)}
          </p>
          <p className="text-xs text-white/40">CCU</p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/games/${game.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] transition hover:border-white/20 hover:bg-white/[0.06]"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-white/10">
        {game.thumbnailUrl && (
          <Image
            src={game.thumbnailUrl}
            alt={game.name}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        )}
        <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs font-medium text-emerald-400 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          {formatCompactNumber(game.ccu)}
        </div>
      </div>
      <div className="flex flex-col gap-1 p-3">
        <div className="flex items-center gap-2">
          <p className="truncate font-medium">{game.name}</p>
          {game.verified && <Badge variant="verified">✓</Badge>}
        </div>
        <p className="truncate text-sm text-white/50">
          {game.studioName ?? "Unknown studio"}
        </p>
        {game.genre && <Badge>{game.genre}</Badge>}
      </div>
    </Link>
  );
}
