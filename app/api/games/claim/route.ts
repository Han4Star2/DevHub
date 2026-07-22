import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { claimGameByUniverseId } from "@/lib/db/queries/dashboard";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const universeId = Number(body?.universeId);
  if (!Number.isFinite(universeId) || universeId <= 0) {
    return NextResponse.json({ error: "Invalid universe ID" }, { status: 400 });
  }

  const result = await claimGameByUniverseId(user.id, universeId);
  if (!result.ok) {
    const message =
      result.reason === "not_found"
        ? "No tracked game found with that universe ID"
        : "This game has already been claimed by another user";
    return NextResponse.json({ error: message }, { status: 409 });
  }

  return NextResponse.json({ ok: true });
}
