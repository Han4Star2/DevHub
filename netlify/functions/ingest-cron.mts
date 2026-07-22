// Netlify Scheduled Function - triggers our existing ingestion endpoint on a
// timer, since Netlify doesn't read vercel.json's cron config. Kept as a
// thin trigger (not a reimplementation) so there's one ingestion code path.
async function ingestCron() {
  const base = process.env.APP_BASE_URL;
  const secret = process.env.CRON_SECRET;

  if (!base || !secret) {
    console.error("[ingest-cron] APP_BASE_URL or CRON_SECRET is not set");
    return new Response("Missing APP_BASE_URL or CRON_SECRET", { status: 500 });
  }

  const url = `${base.replace(/\/$/, "")}/api/cron/ingest`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${secret}` },
  });
  const body = await res.text();
  console.log(`[ingest-cron] ${res.status} ${body}`);

  return new Response(body, { status: res.status });
}

export default ingestCron;

export const config = {
  schedule: "*/30 * * * *",
};
