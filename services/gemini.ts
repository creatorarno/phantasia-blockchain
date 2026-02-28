// ═══════════════════════════════════════════════════════════════
//  GEMINI AI SERVICE — Code analysis via Google Gemini API
// ═══════════════════════════════════════════════════════════════

import type { AIAnalysis } from "./types";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? "";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_PROMPT = `You are an expert code reviewer for an open-source contribution protocol.
Analyze the given git diff and return a JSON object with EXACTLY these fields:
{
  "summary": "1-2 sentence human-readable summary of the changes",
  "impactScore": <number 0-10, where 10 is highest impact>,
  "riskLevel": "<low|medium|high|critical>",
  "contributionType": "<bugfix|feature|refactor|docs|test|chore|security|performance>",
  "suggestions": ["optional improvement suggestion 1", "suggestion 2"]
}
Return ONLY valid JSON, no markdown fences, no extra text.`;

/**
 * Analyze a git diff using Google Gemini.
 * Returns structured AI analysis.
 */
export async function analyzeWithGemini(
  title: string,
  diff: string
): Promise<AIAnalysis> {
  if (!GEMINI_API_KEY) {
    console.warn("⚠ GEMINI_API_KEY not set — returning mock analysis");
    return mockAnalysis(title);
  }

  // Truncate very large diffs to stay within token limits
  const truncatedDiff = diff.length > 12000 ? diff.slice(0, 12000) + "\n... [truncated]" : diff;

  try {
    const res = await fetch(GEMINI_URL, {
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
          temperature: 0.2,
          maxOutputTokens: 1024,
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
    const cleaned = text
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/g, "")
      .trim();

    const parsed: AIAnalysis = JSON.parse(cleaned);

    // Validate & clamp
    parsed.impactScore = Math.max(0, Math.min(10, Number(parsed.impactScore) || 5));
    if (!["low", "medium", "high", "critical"].includes(parsed.riskLevel)) {
      parsed.riskLevel = "medium";
    }
    if (!parsed.suggestions) parsed.suggestions = [];

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
    riskLevel: "medium",
    contributionType: "feature",
    suggestions: ["Consider adding tests", "Ensure documentation is updated"],
  };
}
