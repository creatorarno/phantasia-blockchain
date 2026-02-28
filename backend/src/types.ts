// ═══════════════════════════════════════════════════════════════
//  SHARED TYPES — Request/response contracts for the API
// ═══════════════════════════════════════════════════════════════

/** Gemini AI analysis result */
export interface AIAnalysis {
  summary: string;

  impactScore: number;
  qualityScore: number;
  securityScore: number;
  complexityScore: number;
  sizeScore: number;
  confidenceScore: number;

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

  isSecurityRelevant: boolean;
  hasSecurityRisk: boolean;
  hasBreakingChange: boolean;
  introducesVulnerability: boolean;
  fixesVulnerability: boolean;

  issues: string[];
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

/** POST /api/submit-diff — request body */
export interface SubmitDiffRequest {
  title: string;
  diff: string;
  contributor: string; // wallet address
  gitBranch?: string;
  message?: string;
}

/** POST /api/submit-diff — response body */
export interface SubmitDiffResponse {
  success: true;
  cid: string;
  analysis: AIAnalysis;
  ipfsUrl: string;
}

/** Error response */
export interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
}
