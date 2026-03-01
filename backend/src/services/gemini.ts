// ═══════════════════════════════════════════════════════════════
//  GEMINI AI SERVICE — Code analysis via Google Gemini API
// ═══════════════════════════════════════════════════════════════

import { getConfig } from "../config/index.js";
import type { AIAnalysis } from "../types.js";

const SYSTEM_PROMPT = `You are CommitChain Auditor v1. A deterministic, security-focused code review and reputation scoring engine used in a decentralized blockchain contribution tracking system.

Your purpose is to objectively evaluate git diffs and produce a STRICT JSON analysis used to calculate permanent on-chain reputation.

CRITICAL REQUIREMENTS:

- Output ONLY valid JSON
- Do NOT output markdown
- Do NOT output explanations outside JSON
- Do NOT output code fences
- Do NOT output extra text
- Output must be directly parsable by JSON.parse()
- All numeric scores MUST be integers from 0-10
- Be strict, realistic, and conservative in scoring
- Do NOT inflate scores
- Assume malicious intent is possible

You are evaluating contribution quality, security, and impact for permanent blockchain storage.

EVALUATION CRITERIA:

1. Functional Impact
   - Does this change meaningfully improve functionality?
   - Does it fix bugs?
   - Does it introduce or modify important logic?

2. Security Analysis
   Detect:
   - Secrets exposure (private keys, tokens, credentials)
   - Injection vulnerabilities
   - Unsafe deserialization
   - Access control issues / authentication bypass
   - Unsafe eval or dynamic execution
   - Memory safety issues / race conditions
   - Blockchain vulnerabilities (reentrancy, overflow, unchecked calls)

3. Code Quality
   Evaluate:
   - Readability and maintainability
   - Naming clarity and structure
   - Best practices and error handling

4. Architectural Complexity
   Evaluate:
   - Scope of change and cognitive complexity
   - Cross-module and system-level impact

5. Size and Significance
   Evaluate:
   - Lines changed and logical weight
   - Whether the change is trivial or substantial

6. Risk Assessment
   Evaluate:
   - Probability of introducing bugs
   - Breaking existing behavior
   - Security risk

SCORING DEFINITIONS:

impactScore (0-10):       0 = no meaningful impact, 5 = moderate, 10 = critical system impact
qualityScore (0-10):      0 = very poor, 5 = acceptable, 8 = high quality, 10 = excellent production-grade
securityScore (0-10):     0 = no security relevance, 5 = moderate, 10 = critical vulnerability fix or introduction
complexityScore (0-10):   0 = trivial, 5 = moderate, 10 = very complex system-level change
sizeScore (0-10):         0 = extremely small, 5 = medium, 10 = very large change
confidenceScore (0-10):   Confidence in analysis accuracy

RISK LEVEL RULES:
- low: Safe change, unlikely to break system
- medium: Moderate risk, requires review
- high: High risk, likely to introduce bugs
- critical: Severe security risk or dangerous change

CONTRIBUTION TYPE: bugfix | feature | refactor | docs | test | chore | security | performance

SECURITY FLAGS (boolean):
- isSecurityRelevant
- hasSecurityRisk
- hasBreakingChange
- introducesVulnerability
- fixesVulnerability

OUTPUT FORMAT (STRICT JSON):
{
  "summary": "Technical summary of what the change does",
  "impactScore": 0,
  "qualityScore": 0,
  "securityScore": 0,
  "complexityScore": 0,
  "sizeScore": 0,
  "confidenceScore": 0,
  "riskLevel": "low|medium|high|critical",
  "contributionType": "bugfix|feature|refactor|docs|test|chore|security|performance",
  "isSecurityRelevant": false,
  "hasSecurityRisk": false,
  "hasBreakingChange": false,
  "introducesVulnerability": false,
  "fixesVulnerability": false,
  "issues": ["List concrete problems found"],
  "suggestions": ["List actionable improvements"]
}

Analyze the diff thoroughly and return ONLY the JSON object. Do not include any other text.`;

const MAX_DIFF_LENGTH = 15_000;

/**
 * Analyze a git diff using Google Gemini.
 * Returns structured AI analysis.
 */
export async function analyzeWithGemini(
  title: string,
  diff: string
): Promise<AIAnalysis> {
  const { GEMINI_API_KEY } = getConfig();

  if (!GEMINI_API_KEY) {
    console.warn("⚠ GEMINI_API_KEY not set — returning mock analysis");
    return mockAnalysis(title);
  }

  const truncatedDiff =
    diff.length > MAX_DIFF_LENGTH
      ? diff.slice(0, MAX_DIFF_LENGTH) + "\n... [truncated]"
      : diff;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${SYSTEM_PROMPT}\n\nTitle: ${title}\n\nGit Diff:\n\`\`\`\n${truncatedDiff}\n\`\`\``,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API error (${res.status}): ${errText}`);
    }

    const json = await res.json();
    const text: string =
      json?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    // Strip markdown fences if present
    let cleaned = text
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/g, "")
      .trim();

    // Extract the JSON object if surrounded by extra text
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleaned = jsonMatch[0];
    }

    // Fix common Gemini JSON quirks:
    // 1. Trailing commas before } or ]
    cleaned = cleaned.replace(/,\s*([\]}])/g, "$1");
    // 2. Single-line // comments
    cleaned = cleaned.replace(/\/\/[^\n]*/g, "");
    // 3. Multi-line /* */ comments
    cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, "");
    // 4. Unquoted property values that are words (but not true/false/null/numbers)
    //    e.g. contributionType: feature → contributionType: "feature"
    cleaned = cleaned.replace(
      /:\s*(?!true|false|null|[\d\-"\[{])([a-zA-Z_]\w*)\s*([,\}])/g,
      ': "$1"$2'
    );

    let parsed: AIAnalysis;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error("Gemini returned unparseable JSON, raw text:", text);
      throw parseErr;
    }

    // Validate & clamp all numeric scores to 0–10 integers
    const clampScore = (v: unknown, fallback = 5): number =>
      Math.max(0, Math.min(10, Math.round(Number(v) || fallback)));

    parsed.impactScore = clampScore(parsed.impactScore);
    parsed.qualityScore = clampScore(parsed.qualityScore);
    parsed.securityScore = clampScore(parsed.securityScore, 0);
    parsed.complexityScore = clampScore(parsed.complexityScore);
    parsed.sizeScore = clampScore(parsed.sizeScore);
    parsed.confidenceScore = clampScore(parsed.confidenceScore, 7);

    // Validate enums
    if (
      !["low", "medium", "high", "critical"].includes(parsed.riskLevel)
    ) {
      parsed.riskLevel = "medium";
    }
    const validTypes = [
      "bugfix", "feature", "refactor", "docs",
      "test", "chore", "security", "performance",
    ];
    if (!validTypes.includes(parsed.contributionType)) {
      parsed.contributionType = "chore";
    }

    // Validate boolean flags
    parsed.isSecurityRelevant = Boolean(parsed.isSecurityRelevant);
    parsed.hasSecurityRisk = Boolean(parsed.hasSecurityRisk);
    parsed.hasBreakingChange = Boolean(parsed.hasBreakingChange);
    parsed.introducesVulnerability = Boolean(parsed.introducesVulnerability);
    parsed.fixesVulnerability = Boolean(parsed.fixesVulnerability);

    // Validate arrays
    if (!Array.isArray(parsed.issues)) parsed.issues = [];
    if (!Array.isArray(parsed.suggestions)) parsed.suggestions = [];

    return parsed;
  } catch (err) {
    console.error("Gemini analysis failed, using fallback:", err);
    return mockAnalysis(title);
  }
}

/** Fallback when Gemini is unavailable */
function mockAnalysis(title: string): AIAnalysis {
  return {
    summary: `Contribution: "${title}" — AI analysis unavailable, manual review recommended.`,
    impactScore: 5,
    qualityScore: 5,
    securityScore: 0,
    complexityScore: 5,
    sizeScore: 5,
    confidenceScore: 0,
    riskLevel: "medium",
    contributionType: "feature",
    isSecurityRelevant: false,
    hasSecurityRisk: false,
    hasBreakingChange: false,
    introducesVulnerability: false,
    fixesVulnerability: false,
    issues: [],
    suggestions: ["Consider adding tests", "Ensure documentation is updated"],
  };
}
