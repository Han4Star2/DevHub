import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import {
  USERNAME_RE,
  getUserByUsername,
  updateUserProfile,
} from "@/lib/db/queries/users";

const MAX_BIO_LENGTH = 500;

export async function POST(request: Request) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const username =
    typeof body?.username === "string" ? body.username.trim().toLowerCase() : "";
  const name = typeof body?.name === "string" ? body.name.trim() : null;
  const bio =
    typeof body?.bio === "string" ? body.bio.trim().slice(0, MAX_BIO_LENGTH) : null;
  const skills = typeof body?.skills === "string" ? body.skills.trim() : null;
  const avatarUrl =
    typeof body?.avatarUrl === "string" && body.avatarUrl.trim()
      ? body.avatarUrl.trim()
      : null;

  if (!USERNAME_RE.test(username)) {
    return NextResponse.json(
      {
        error:
          "Username must be 3-30 characters, lowercase letters, numbers, and hyphens only",
      },
      { status: 400 },
    );
  }

  const existing = await getUserByUsername(username);
  if (existing && existing.id !== sessionUser.id) {
    return NextResponse.json(
      { error: "That username is already taken" },
      { status: 409 },
    );
  }

  const user = await updateUserProfile(sessionUser.id, {
    username,
    name,
    bio,
    skills,
    avatarUrl,
  });

  return NextResponse.json({ username: user.username });
}
