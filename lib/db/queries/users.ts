import { eq } from "drizzle-orm";
import { db } from "../client";
import { users } from "../schema";

export async function getUserByEmail(email: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1);
  return user;
}

export async function createUser(fields: {
  email: string;
  passwordHash: string;
  name?: string | null;
}) {
  const [user] = await db
    .insert(users)
    .values({ ...fields, email: fields.email.toLowerCase() })
    .returning();
  return user;
}
