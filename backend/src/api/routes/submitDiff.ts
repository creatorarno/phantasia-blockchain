// ═══════════════════════════════════════════════════════════════
//  ROUTE — POST /api/submit-diff
//  Accepts git diff + metadata → Gemini analysis → IPFS pin
//  Returns { cid, analysis, ipfsUrl }
// ═══════════════════════════════════════════════════════════════

import { Router, type Request, type Response } from "express";
import { ZodError } from "zod";
import { submitDiffSchema } from "../../validation/schemas.js";
import { analyzeWithGemini } from "../../services/gemini.js";
import { pinContribution, ipfsUrl } from "../../services/pinata.js";
import type {
  ContributionPayload,
  SubmitDiffResponse,
  ErrorResponse,
} from "../../types.js";

const router = Router();

router.post(
  "/",
  async (
    req: Request,
    res: Response<SubmitDiffResponse | ErrorResponse>
  ): Promise<void> => {
    try {
      // ── 1. Validate input ──────────────────────────────────
      const data = submitDiffSchema.parse(req.body);

      console.log(
        `📥 submit-diff | title="${data.title}" | contributor=${data.contributor} | diff=${data.diff.length} chars`
      );

      // ── 2. AI Analysis ─────────────────────────────────────
      console.log("🧠 Running Gemini analysis...");
      const analysis = await analyzeWithGemini(data.title, data.diff);

      console.log(
        `✅ AI done | impact=${analysis.impactScore}/10 | risk=${analysis.riskLevel} | type=${analysis.contributionType}`
      );

      // ── 3. Build IPFS payload ──────────────────────────────
      const payload: ContributionPayload = {
        title: data.title,
        diff: data.diff,
        analysis,
        contributor: data.contributor,
        timestamp: Date.now(),
        gitBranch: data.gitBranch,
      };

      // ── 4. Pin to IPFS ─────────────────────────────────────
      console.log("📌 Pinning to IPFS...");
      const cid = await pinContribution(payload);
      console.log(`✅ Pinned | CID=${cid}`);

      // ── 5. Return result ───────────────────────────────────
      res.status(200).json({
        success: true,
        cid,
        analysis,
        ipfsUrl: ipfsUrl(cid),
      });
    } catch (err) {
      if (err instanceof ZodError) {
        const messages = err.errors.map(
          (e) => `${e.path.join(".")}: ${e.message}`
        );
        res.status(400).json({
          success: false,
          error: `Validation failed: ${messages.join("; ")}`,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      console.error("submit-diff error:", err);

      const message =
        err instanceof Error ? err.message : "Unknown error";
      res.status(500).json({
        success: false,
        error: message,
        code: "PROCESSING_ERROR",
      });
    }
  }
);

export default router;
