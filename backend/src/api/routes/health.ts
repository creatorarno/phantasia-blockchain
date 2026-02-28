// ═══════════════════════════════════════════════════════════════
//  ROUTE — GET /api/health
//  Quick health check + uptime
// ═══════════════════════════════════════════════════════════════

import { Router, type Request, type Response } from "express";

const router = Router();

router.get("/", (_req: Request, res: Response): void => {
  res.status(200).json({
    status: "ok",
    service: "commitchain-backend",
    version: "1.0.0",
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

export default router;
