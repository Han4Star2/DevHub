import { NextResponse } from "next/server";
import { verifyPassword } from "@/lib/auth/password";
import { createSession, setSessionCookie } from "@/lib/auth/session";
import { getUserByEmail } from "@/lib/db/queries/users";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  const genericError = NextResponse.json(
    { error: "Invalid email or password" },
    { status: 401 },
  );

  if (!email || !password) return genericError;

  const user = await getUserByEmail(email);
  if (!user) return genericError;

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return genericError;

  const { token, expiresAt } = await createSession(user.id);
  await setSessionCookie(token, expiresAt);

  return NextResponse.json({ id: user.id, email: user.email, name: user.name });
}
