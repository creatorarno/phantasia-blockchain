// ═══════════════════════════════════════════════════════════════
//  EXPRESS APP — Route mounting + middleware stack
// ═══════════════════════════════════════════════════════════════

import express from "express";
import cors from "cors";
import helmet from "helmet";
import { getConfig } from "../config/index.js";
import {
  createRateLimiter,
  apiKeyAuth,
  diffSizeGuard,
  errorHandler,
} from "../middleware/index.js";

// Routes
import healthRouter from "./routes/health.js";
import submitDiffRouter from "./routes/submitDiff.js";

export function createApp() {
  const app = express();
  const config = getConfig();

  // ─── Security headers ─────────────────────────────────────
  app.use(helmet());

  // ─── CORS ──────────────────────────────────────────────────
  const origins = config.CORS_ORIGINS
    ? config.CORS_ORIGINS.split(",").map((o) => o.trim())
    : true; // allow all if not specified

  app.use(
    cors({
      origin: origins,
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type", "X-API-Key", "Authorization"],
    })
  );

  // ─── Body parsing ─────────────────────────────────────────
  app.use(express.json({ limit: "2mb" }));

  // ─── Trust proxy (for Vercel / Railway / etc.) ─────────────
  app.set("trust proxy", 1);

  // ─── Rate limiting ────────────────────────────────────────
  app.use("/api/", createRateLimiter());

  // ─── Optional API key auth ────────────────────────────────
  app.use("/api/submit-diff", apiKeyAuth);

  // ─── Diff size guard ──────────────────────────────────────
  app.use("/api/submit-diff", diffSizeGuard);

  // ─── Routes ────────────────────────────────────────────────
  app.use("/api/health", healthRouter);
  app.use("/api/submit-diff", submitDiffRouter);

  // ─── Root ──────────────────────────────────────────────────
  app.get("/", (_req, res) => {
    res.json({
      name: "CommitChain Backend API",
      version: "1.0.0",
      docs: "/api/health",
      endpoints: {
        "POST /api/submit-diff": "Submit a git diff for AI analysis + IPFS pinning",
        "GET /api/health": "Health check",
      },
    });
  });

  // ─── 404 ───────────────────────────────────────────────────
  app.use((_req, res) => {
    res.status(404).json({
      success: false,
      error: "Endpoint not found",
      code: "NOT_FOUND",
    });
  });

  // ─── Global error handler ─────────────────────────────────
  app.use(errorHandler);

  return app;
}
