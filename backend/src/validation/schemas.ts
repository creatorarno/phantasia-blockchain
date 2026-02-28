// ═══════════════════════════════════════════════════════════════
//  VALIDATION — Zod schemas for request validation
// ═══════════════════════════════════════════════════════════════

import { z } from "zod";

/** Ethereum address regex (0x + 40 hex chars) */
const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;

export const submitDiffSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be at most 200 characters"),
  diff: z
    .string()
    .min(1, "Diff cannot be empty"),
  contributor: z
    .string()
    .regex(ethAddressRegex, "Invalid Ethereum wallet address"),
  gitBranch: z.string().optional(),
  message: z.string().max(500).optional(),
});

export type ValidatedSubmitDiff = z.infer<typeof submitDiffSchema>;
