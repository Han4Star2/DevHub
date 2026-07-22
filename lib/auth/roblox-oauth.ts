import { createHash, randomBytes } from "node:crypto";

const AUTHORIZE_URL = "https://apis.roblox.com/oauth/v1/authorize";
const TOKEN_URL = "https://apis.roblox.com/oauth/v1/token";
const USERINFO_URL = "https://apis.roblox.com/oauth/v1/userinfo";

export const ROBLOX_OAUTH_COOKIE = "roblox_oauth_pending";

function base64url(input: Buffer): string {
  return input
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function generatePkcePair() {
  const verifier = base64url(randomBytes(32));
  const challenge = base64url(createHash("sha256").update(verifier).digest());
  return { verifier, challenge };
}

export function generateState(): string {
  return base64url(randomBytes(16));
}

export function getRedirectUri(): string {
  const base = process.env.APP_BASE_URL;
  if (!base) {
    throw new Error("APP_BASE_URL is not set");
  }
  return `${base.replace(/\/$/, "")}/api/auth/roblox/callback`;
}

export function buildAuthorizeUrl({
  state,
  codeChallenge,
}: {
  state: string;
  codeChallenge: string;
}): string {
  const clientId = process.env.ROBLOX_OAUTH_CLIENT_ID;
  if (!clientId) throw new Error("ROBLOX_OAUTH_CLIENT_ID is not set");

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: getRedirectUri(),
    scope: "openid profile",
    response_type: "code",
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });
  return `${AUTHORIZE_URL}?${params.toString()}`;
}

interface RobloxTokenResponse {
  access_token: string;
  id_token?: string;
  token_type: string;
  expires_in: number;
}

export async function exchangeCodeForToken(
  code: string,
  codeVerifier: string,
): Promise<RobloxTokenResponse> {
  const clientId = process.env.ROBLOX_OAUTH_CLIENT_ID;
  const clientSecret = process.env.ROBLOX_OAUTH_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("ROBLOX_OAUTH_CLIENT_ID/SECRET are not set");
  }

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "authorization_code",
      code,
      redirect_uri: getRedirectUri(),
      code_verifier: codeVerifier,
    }),
  });

  if (!res.ok) {
    throw new Error(`Roblox token exchange failed: ${res.status}`);
  }
  return res.json();
}

export interface RobloxUserInfo {
  sub: string; // Roblox user ID
  preferred_username?: string;
  name?: string;
  picture?: string;
}

export async function fetchRobloxUserInfo(
  accessToken: string,
): Promise<RobloxUserInfo> {
  const res = await fetch(USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    throw new Error(`Roblox userinfo request failed: ${res.status}`);
  }
  return res.json();
}
