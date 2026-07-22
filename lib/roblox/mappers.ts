import type {
  RobloxGameDetails,
  RobloxGameIcon,
  RobloxGameVotes,
} from "./types";
import type { NewGameStatsSnapshot } from "../db/schema";

export function slugify(name: string, universeId: number): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${base || "game"}-${universeId}`;
}

export function toSnapshot(
  gameId: string,
  details: RobloxGameDetails,
  votes: RobloxGameVotes | undefined,
): Omit<NewGameStatsSnapshot, "capturedAt"> {
  const upVotes = votes?.upVotes ?? 0;
  const downVotes = votes?.downVotes ?? 0;
  const totalVotes = upVotes + downVotes;
  const ratingPct = totalVotes > 0 ? (upVotes / totalVotes) * 100 : null;

  return {
    gameId,
    ccu: details.playing,
    visits: details.visits,
    favorites: details.favoritedCount,
    likes: upVotes,
    dislikes: downVotes,
    ratingPct: ratingPct !== null ? ratingPct.toFixed(2) : null,
  };
}

export function toGameFields(
  details: RobloxGameDetails,
  icon: RobloxGameIcon | undefined,
) {
  return {
    name: details.name,
    rootPlaceId: details.rootPlaceId,
    studioName: details.creator?.name ?? null,
    studioId: details.creator?.id ?? null,
    description: details.description ?? null,
    genre: details.genre_l1 ?? details.genre ?? null,
    thumbnailUrl: icon?.imageUrl ?? null,
    verified: details.creator?.hasVerifiedBadge ?? false,
  };
}
