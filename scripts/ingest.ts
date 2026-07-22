import "dotenv/config";
import { runIngestion } from "../lib/ingestion/run";

runIngestion()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("[ingest] fatal error", err);
    process.exit(1);
  });
