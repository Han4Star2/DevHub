import "dotenv/config";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { upsertGameByUniverseId } from "../lib/db/queries/upsert";
import {
  fetchGameIcons,
  fetchGamesDetails,
  resolveUniverseId,
} from "../lib/roblox/client";
import { slugify, toGameFields } from "../lib/roblox/mappers";

interface StarterGame {
  placeId: number;
  note?: string;
}

/**
 * `starter-games.json` intentionally ships with only one verified entry.
 * This sandbox's network egress policy blocks games.roblox.com/apis.roblox.com,
 * so no additional IDs could be looked up or validated here. To grow the
 * tracked list, open a game's page on roblox.com — the numeric ID in the
 * URL (roblox.com/games/{id}/...) is its rootPlaceId — and add
 * { "placeId": <id> } entries to starter-games.json, then re-run this
 * script from an environment with real internet access.
 */
async function loadStarterGames(): Promise<StarterGame[]> {
  const raw = readFileSync(
    join(__dirname, "starter-games.json"),
    "utf-8",
  );
  return JSON.parse(raw) as StarterGame[];
}

async function seed() {
  const starterGames = await loadStarterGames();
  console.log(`[seed] resolving ${starterGames.length} starter game(s)...`);

  for (const { placeId, note } of starterGames) {
    try {
      const universeId = await resolveUniverseId(placeId);
      const [details] = await fetchGamesDetails([universeId]);
      if (!details) {
        console.warn(
          `[seed] no game details returned for placeId=${placeId} (universeId=${universeId}), skipping`,
        );
        continue;
      }
      const [icon] = await fetchGameIcons([universeId]);

      const id = await upsertGameByUniverseId({
        universeId,
        slug: slugify(details.name, universeId),
        isActive: true,
        ...toGameFields(details, icon),
      });

      console.log(
        `[seed] upserted "${details.name}" (${note ?? "no note"}) -> id=${id}`,
      );
    } catch (err) {
      console.error(`[seed] failed to seed placeId=${placeId}:`, err);
    }
  }
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("[seed] fatal error", err);
    process.exit(1);
  });
