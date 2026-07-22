import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ROBLOX_OAUTH_COOKIE,
  exchangeCodeForToken,
  fetchRobloxUserInfo,
} from "@/lib/auth/roblox-oauth";
import { createSession, setSessionCookie } from "@/lib/auth/session";
import {
  createRobloxUser,
  generateUniqueUsernameFromRoblox,
  getUserByRobloxId,
} from "@/lib/db/queries/users";

function failure(request: Request, reason: string) {
  const url = new URL("/login", request.url);
  url.searchParams.set("error", reason);
  return NextResponse.redirect(url);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const cookieStore = await cookies();
  const pending = cookieStore.get(ROBLOX_OAUTH_COOKIE)?.value;
  cookieStore.delete(ROBLOX_OAUTH_COOKIE);

  if (!code || !state || !pending) {
    return failure(request, "roblox_missing_params");
  }

  let verifier: string;
  try {
    const parsed = JSON.parse(pending) as { verifier: string; state: string };
    if (parsed.state !== state) {
      return failure(request, "roblox_state_mismatch");
    }
    verifier = parsed.verifier;
  } catch {
    return failure(request, "roblox_invalid_state");
  }

  try {
    const tokens = await exchangeCodeForToken(code, verifier);
    const robloxUser = await fetchRobloxUserInfo(tokens.access_token);

    let user = await getUserByRobloxId(robloxUser.sub);
    if (!user) {
      const robloxUsername = robloxUser.preferred_username ?? robloxUser.sub;
      const username = await generateUniqueUsernameFromRoblox(robloxUsername);
      user = await createRobloxUser({
        robloxUserId: robloxUser.sub,
        robloxUsername,
        username,
        name: robloxUser.name ?? robloxUsername,
        avatarUrl: robloxUser.picture ?? null,
      });
    }

    const { token, expiresAt } = await createSession(user.id);
    await setSessionCookie(token, expiresAt);

    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (err) {
    console.error("[roblox-oauth] callback failed", err);
    return failure(request, "roblox_exchange_failed");
  }
}
