import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  SESSION_COOKIE_NAME,
  clearSessionCookie,
  destroySession,
} from "@/lib/auth/session";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (token) await destroySession(token);
  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}
