import pLimit from "p-limit";
import { db } from "../db/client";
import { gameStatsSnapshots, type Game } from "../db/schema";
import { getActiveGames, updateGameFields } from "../db/queries/games";
import {
  chunk,
  fetchGameIcons,
  fetchGamesDetails,
  fetchGameVotes,
} from "../roblox/client";
import { toGameFields, toSnapshot } from "../roblox/mappers";

const BATCH_SIZE = 50;
const CHUNK_CONCURRENCY = 3;

export interface IngestSummary {
  gamesProcessed: number;
  gamesFailed: number;
  durationMs: number;
}

export async function runIngestion(): Promise<IngestSummary> {
  const startedAt = Date.now();
  const activeGames = await getActiveGames();
  const byUniverseId = new Map<number, Game>(
    activeGames.map((g) => [g.universeId, g]),
  );

  let gamesProcessed = 0;
  let gamesFailed = 0;

  const chunks = chunk(activeGames.map((g) => g.universeId), BATCH_SIZE);
  const limit = pLimit(CHUNK_CONCURRENCY);

  await Promise.all(
    chunks.map((universeIds) =>
      limit(async () => {
        try {
          const [details, votes, icons] = await Promise.all([
            fetchGamesDetails(universeIds),
            fetchGameVotes(universeIds),
            fetchGameIcons(universeIds),
          ]);

          const votesById = new Map(votes.map((v) => [v.id, v]));
          const iconsById = new Map(icons.map((i) => [i.targetId, i]));

          const snapshotRows = [];

          for (const detail of details) {
            const game = byUniverseId.get(detail.id);
            if (!game) continue;

            snapshotRows.push(
              toSnapshot(game.id, detail, votesById.get(detail.id)),
            );

            const nextFields = toGameFields(detail, iconsById.get(detail.id));
            const changed =
              nextFields.name !== game.name ||
              nextFields.genre !== game.genre ||
              nextFields.thumbnailUrl !== game.thumbnailUrl ||
              nextFields.studioName !== game.studioName;
            if (changed) {
              await updateGameFields(game.id, nextFields);
            }

            gamesProcessed++;
          }

          if (snapshotRows.length > 0) {
            await db.insert(gameStatsSnapshots).values(snapshotRows);
          }
        } catch (err) {
          gamesFailed += universeIds.length;
          console.error(
            `[ingest] failed batch of ${universeIds.length} games:`,
            err,
          );
        }
      }),
    ),
  );

  const summary: IngestSummary = {
    gamesProcessed,
    gamesFailed,
    durationMs: Date.now() - startedAt,
  };
  console.log("[ingest] summary", summary);
  return summary;
}
