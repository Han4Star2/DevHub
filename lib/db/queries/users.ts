import { eq } from "drizzle-orm";
import { db } from "../client";
import { users } from "../schema";

export const USERNAME_RE = /^[a-z0-9-]{3,30}$/;

export async function getUserByEmail(email: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1);
  return user;
}

export async function getUserByUsername(username: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.username, username.toLowerCase()))
    .limit(1);
  return user;
}

export async function getUserByRobloxId(robloxUserId: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.robloxUserId, robloxUserId))
    .limit(1);
  return user;
}

/**
 * Slugifies a Roblox display name into a valid, unique Core Vision username
 * by appending a numeric suffix on collision. Used only at first Roblox
 * sign-in - the user can change it afterward in /settings/profile.
 */
export async function generateUniqueUsernameFromRoblox(
  robloxUsername: string,
): Promise<string> {
  const base =
    robloxUsername
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 25) || "roblox-dev";

  let candidate = base;
  let suffix = 1;
  while (await getUserByUsername(candidate)) {
    suffix += 1;
    candidate = `${base}-${suffix}`;
  }
  return candidate;
}

export async function createRobloxUser(fields: {
  robloxUserId: string;
  robloxUsername: string;
  username: string;
  name?: string | null;
  avatarUrl?: string | null;
}) {
  const [user] = await db
    .insert(users)
    .values({
      // Roblox's OAuth scope set doesn't include email; synthesize a unique
      // placeholder so the NOT NULL/unique email constraint still holds.
      email: `roblox-${fields.robloxUserId}@users.noreply.corevision.local`,
      passwordHash: null,
      robloxUserId: fields.robloxUserId,
      robloxUsername: fields.robloxUsername,
      username: fields.username.toLowerCase(),
      name: fields.name ?? fields.robloxUsername,
      avatarUrl: fields.avatarUrl ?? null,
    })
    .returning();
  return user;
}

export async function createUser(fields: {
  email: string;
  passwordHash: string;
  username: string;
  name?: string | null;
}) {
  const [user] = await db
    .insert(users)
    .values({
      ...fields,
      email: fields.email.toLowerCase(),
      username: fields.username.toLowerCase(),
    })
    .returning();
  return user;
}

export async function updateUserProfile(
  userId: string,
  fields: Partial<{
    username: string;
    name: string | null;
    bio: string | null;
    skills: string | null;
    avatarUrl: string | null;
  }>,
) {
  const normalized = fields.username
    ? { ...fields, username: fields.username.toLowerCase() }
    : fields;
  const [user] = await db
    .update(users)
    .set(normalized)
    .where(eq(users.id, userId))
    .returning();
  return user;
}
