import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { sessions, users, type User } from "../db/schema";

export const SESSION_COOKIE_NAME = "session";
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  await db.insert(sessions).values({ id: token, userId, expiresAt });
  return { token, expiresAt };
}

/** Must be called from a Route Handler or Server Action, not a Server Component render. */
export async function setSessionCookie(token: string, expiresAt: Date) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

/** Must be called from a Route Handler or Server Action, not a Server Component render. */
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function destroySession(token: string) {
  await db.delete(sessions).where(eq(sessions.id, token));
}

export async function getSessionUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const [row] = await db
    .select({ user: users, expiresAt: sessions.expiresAt })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.id, token))
    .limit(1);

  if (!row || row.expiresAt < new Date()) return null;
  return row.user;
}
