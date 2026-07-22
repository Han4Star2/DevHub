import "dotenv/config";
import { defineConfig } from "drizzle-kit";

// Migrations need a direct (non-transaction-pooled) connection - Supabase's
// pgbouncer transaction pooler doesn't support the session-level behavior
// drizzle-kit relies on. Falls back to DATABASE_URL for setups (like local
// Docker Postgres) that only have a single connection string.
const migrationUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!migrationUrl) {
  throw new Error("DIRECT_URL or DATABASE_URL must be set");
}

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: migrationUrl,
  },
});
