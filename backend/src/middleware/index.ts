// ═══════════════════════════════════════════════════════════════
//  MIDDLEWARE — Rate limiter, auth, validation, error handling
// ═══════════════════════════════════════════════════════════════

import type { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import { getConfig } from "../config/index.js";

// ─── Rate Limiter ────────────────────────────────────────────

export function createRateLimiter() {
  const { RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX_REQUESTS } = getConfig();

  return rateLimit({
    windowMs: RATE_LIMIT_WINDOW_MS,
    max: RATE_LIMIT_MAX_REQUESTS,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      error: "Too many requests. Please try again later.",
      code: "RATE_LIMITED",
    },
    keyGenerator: (req: Request) => {
      // Use X-Forwarded-For in production (behind proxy), else IP
      return (
        (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ??
        req.ip ??
        "unknown"
      );
    },
  });
}

// ─── API Key Auth (optional) ─────────────────────────────────

export function apiKeyAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { API_SECRET_KEY } = getConfig();

  // If no secret is configured, allow all requests (public mode)
  if (!API_SECRET_KEY) {
    next();
    return;
  }

  const provided = req.headers["x-api-key"] as string | undefined;

  if (!provided || provided !== API_SECRET_KEY) {
    res.status(401).json({
      success: false,
      error: "Invalid or missing API key.",
      code: "UNAUTHORIZED",
    });
    return;
  }

  next();
}

// ─── Request Size Guard ──────────────────────────────────────

const MAX_DIFF_SIZE = 500_000; // 500KB

export function diffSizeGuard(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const diff = req.body?.diff;
  if (typeof diff === "string" && diff.length > MAX_DIFF_SIZE) {
    res.status(413).json({
      success: false,
      error: `Diff too large (${diff.length} chars). Maximum is ${MAX_DIFF_SIZE}.`,
      code: "PAYLOAD_TOO_LARGE",
    });
    return;
  }
  next();
}

// ─── Global Error Handler ────────────────────────────────────

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error("Unhandled error:", err);

  const status = (err as unknown as { status?: number }).status ?? 500;

  res.status(status).json({
    success: false,
    error:
      getConfig().NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
    code: "INTERNAL_ERROR",
  });
}
