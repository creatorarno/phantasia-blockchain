// ═══════════════════════════════════════════════════════════════
//  SHARED TYPES — used by CLI, frontend, and services
// ═══════════════════════════════════════════════════════════════

/** Gemini AI analysis result */
export interface AIAnalysis {
  summary: string;
  impactScore: number; // 0-10
  riskLevel: "low" | "medium" | "high" | "critical";
  contributionType:
    | "bugfix"
    | "feature"
    | "refactor"
    | "docs"
    | "test"
    | "chore"
    | "security"
    | "performance";
  suggestions: string[];
}

/** Full contribution payload stored on IPFS */
export interface ContributionPayload {
  title: string;
  diff: string;
  analysis: AIAnalysis;
  contributor: string;
  timestamp: number;
  gitBranch?: string;
}

/** On-chain contribution record */
export interface OnChainContribution {
  id: number;
  contributor: string;
  title: string;
  ipfsCID: string;
  timestamp: number;
}

/** IPFS-resolved contribution with AI data */
export interface ResolvedContribution extends OnChainContribution {
  payload?: ContributionPayload;
  loading?: boolean;
}

/** Contract submit result */
export interface SubmitResult {
  txHash: string;
  cid: string;
  blockNumber?: number;
}
