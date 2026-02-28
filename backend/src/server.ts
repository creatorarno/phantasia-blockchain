// ═══════════════════════════════════════════════════════════════
//  SERVER ENTRY — Load env, boot Express, listen
// ═══════════════════════════════════════════════════════════════

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load .env from backend root (also check project root as fallback)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import { loadConfig } from "./config/index.js";
import { createApp } from "./api/app.js";

const config = loadConfig();
const app = createApp();

app.listen(config.PORT, () => {
  console.log("");
  console.log("  ╔══════════════════════════════════════════╗");
  console.log("  ║   CommitChain Backend API                ║");
  console.log("  ╚══════════════════════════════════════════╝");
  console.log("");
  console.log(`  🚀 Server running on http://localhost:${config.PORT}`);
  console.log(`  📡 Environment: ${config.NODE_ENV}`);
  console.log(`  🔑 API Key auth: ${config.API_SECRET_KEY ? "ENABLED" : "DISABLED (public)"}`);
  console.log(`  🛡️  Rate limit: ${config.RATE_LIMIT_MAX_REQUESTS} req / ${config.RATE_LIMIT_WINDOW_MS / 1000}s`);
  console.log("");
  console.log("  Endpoints:");
  console.log("    GET  /api/health        → Health check");
  console.log("    POST /api/submit-diff   → Submit contribution");
  console.log("");
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("\nSIGINT received. Shutting down...");
  process.exit(0);
});
