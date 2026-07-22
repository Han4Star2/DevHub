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
