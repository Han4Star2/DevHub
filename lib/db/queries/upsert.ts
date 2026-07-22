import { eq } from "drizzle-orm";
import { db } from "../client";
import { games, type NewGame } from "../schema";

export async function upsertGameByUniverseId(fields: NewGame) {
  const existing = await db
    .select({ id: games.id })
    .from(games)
    .where(eq(games.universeId, fields.universeId))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(games)
      .set({ ...fields, updatedAt: new Date() })
      .where(eq(games.universeId, fields.universeId));
    return existing[0].id;
  }

  const [inserted] = await db.insert(games).values(fields).returning({
    id: games.id,
  });
  return inserted.id;
}
