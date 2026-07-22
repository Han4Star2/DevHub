import type {
  RobloxGamesResponse,
  RobloxIconsResponse,
  RobloxVotesResponse,
} from "./types";

const GAMES_API_BASE =
  process.env.ROBLOX_API_BASE ?? "https://games.roblox.com";
const THUMBNAILS_API_BASE =
  process.env.ROBLOX_THUMBNAILS_API_BASE ?? "https://thumbnails.roblox.com";
const APIS_API_BASE =
  process.env.ROBLOX_APIS_API_BASE ?? "https://apis.roblox.com";

const MAX_RETRIES = 3;
const RETRY_BASE_DELAY_MS = 500;

async function fetchWithRetry(url: string): Promise<Response> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      if (res.ok) return res;
      lastError = new Error(`Roblox API ${url} responded ${res.status}`);
    } catch (err) {
      lastError = err;
    }
    if (attempt < MAX_RETRIES) {
      await new Promise((resolve) =>
        setTimeout(resolve, RETRY_BASE_DELAY_MS * attempt),
      );
    }
  }
  throw lastError;
}

/** Roblox batch endpoints comfortably handle ~50-100 ids per call; chunk conservatively. */
export function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

export async function fetchGamesDetails(
  universeIds: number[],
): Promise<RobloxGamesResponse["data"]> {
  if (universeIds.length === 0) return [];
  const url = `${GAMES_API_BASE}/v1/games?universeIds=${universeIds.join(",")}`;
  const res = await fetchWithRetry(url);
  const json = (await res.json()) as RobloxGamesResponse;
  return json.data ?? [];
}

export async function fetchGameVotes(
  universeIds: number[],
): Promise<RobloxVotesResponse["data"]> {
  if (universeIds.length === 0) return [];
  const url = `${GAMES_API_BASE}/v1/games/votes?universeIds=${universeIds.join(",")}`;
  const res = await fetchWithRetry(url);
  const json = (await res.json()) as RobloxVotesResponse;
  return json.data ?? [];
}

/**
 * Roblox game URLs (roblox.com/games/{placeId}/...) expose a rootPlaceId,
 * not a universeId. The public games endpoints key off universeId, so we
 * resolve it once per place via this official conversion endpoint.
 */
export async function resolveUniverseId(placeId: number): Promise<number> {
  const url = `${APIS_API_BASE}/universes/v1/places/${placeId}/universe`;
  const res = await fetchWithRetry(url);
  const json = (await res.json()) as { universeId: number };
  return json.universeId;
}

export async function fetchGameIcons(
  universeIds: number[],
): Promise<RobloxIconsResponse["data"]> {
  if (universeIds.length === 0) return [];
  const url = `${THUMBNAILS_API_BASE}/v1/games/icons?universeIds=${universeIds.join(",")}&size=512x512&format=Png&isCircular=false`;
  const res = await fetchWithRetry(url);
  const json = (await res.json()) as RobloxIconsResponse;
  return json.data ?? [];
}
