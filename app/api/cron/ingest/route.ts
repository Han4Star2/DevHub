import { NextResponse } from "next/server";
import { runIngestion } from "@/lib/ingestion/run";

export const maxDuration = 60;

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const summary = await runIngestion();
  return NextResponse.json(summary);
}
