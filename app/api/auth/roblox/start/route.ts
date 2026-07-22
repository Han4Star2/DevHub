import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ROBLOX_OAUTH_COOKIE,
  buildAuthorizeUrl,
  generatePkcePair,
  generateState,
} from "@/lib/auth/roblox-oauth";

export async function GET(request: Request) {
  let authorizeUrl: string;
  const { verifier, challenge } = generatePkcePair();
  const state = generateState();

  try {
    authorizeUrl = buildAuthorizeUrl({ state, codeChallenge: challenge });
  } catch (err) {
    console.error("[roblox-oauth] start failed - is it configured?", err);
    const url = new URL("/login", request.url);
    url.searchParams.set("error", "roblox_not_configured");
    return NextResponse.redirect(url);
  }

  const cookieStore = await cookies();
  cookieStore.set(
    ROBLOX_OAUTH_COOKIE,
    JSON.stringify({ verifier, state }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 600, // 10 minutes - just long enough to complete the redirect round trip
    },
  );

  return NextResponse.redirect(authorizeUrl);
}
