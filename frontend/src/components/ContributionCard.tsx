"use client";

import { useState, useEffect } from "react";
import type { OnChainContribution } from "@/hooks/useContract";

// ═══════════════════════════════════════════════════════════════
//  IPFS Payload (matches what CLI/backend pins)
// ═══════════════════════════════════════════════════════════════

interface AIAnalysis {
  summary: string;
  impactScore: number;
  qualityScore: number;
  securityScore: number;
  complexityScore: number;
  sizeScore: number;
  confidenceScore: number;
  riskLevel: string;
  contributionType: string;
  isSecurityRelevant: boolean;
  hasSecurityRisk: boolean;
  hasBreakingChange: boolean;
  introducesVulnerability: boolean;
  fixesVulnerability: boolean;
  issues: string[];
  suggestions: string[];
}

interface IPFSPayload {
  title: string;
  diff: string;
  analysis: AIAnalysis;
  contributor: string;
  timestamp: number;
}

// ═══════════════════════════════════════════════════════════════
//  CONTRIBUTION CARD — Fetches IPFS data & shows AI analysis
// ═══════════════════════════════════════════════════════════════

export function ContributionCard({ c }: { c: OnChainContribution }) {
  const [payload, setPayload] = useState<IPFSPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`https://gateway.pinata.cloud/ipfs/${c.ipfsCID}`, {
          signal: AbortSignal.timeout(6000),
        });
        if (res.ok && !cancelled) {
          const data = await res.json();
          setPayload(data as IPFSPayload);
        }
      } catch {
        // IPFS fetch failed — show on-chain data only
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [c.ipfsCID]);

  const analysis = payload?.analysis;
  const addr = c.contributor;
  const short = addr.slice(0, 6) + "..." + addr.slice(-4);

  // Score color
  function scoreColor(score: number) {
    if (score >= 8) return "text-green-400";
    if (score >= 5) return "text-cyan-400";
    if (score >= 3) return "text-yellow-400";
    return "text-red-400";
  }

  // Score bar width
  function scoreBar(score: number) {
    const pct = Math.round((score / 10) * 100);
    const color =
      score >= 8 ? "bg-green-500" :
      score >= 5 ? "bg-cyan-500" :
      score >= 3 ? "bg-yellow-500" :
      "bg-red-500";
    return { pct, color };
  }

  // Risk badge
  function riskBadge(risk: string) {
    const colors: Record<string, string> = {
      low: "bg-green-500/10 text-green-400 border-green-500/20",
      medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      high: "bg-orange-500/10 text-orange-400 border-orange-500/20",
      critical: "bg-red-500/10 text-red-400 border-red-500/20",
    };
    return colors[risk] ?? colors.medium;
  }

  // Type badge color
  function typeBadge(type: string) {
    const colors: Record<string, string> = {
      bugfix: "border-red-500/20 bg-red-500/10 text-red-400",
      feature: "border-purple-500/20 bg-purple-500/10 text-purple-400",
      refactor: "border-blue-500/20 bg-blue-500/10 text-blue-400",
      docs: "border-gray-500/20 bg-gray-500/10 text-gray-400",
      test: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
      chore: "border-gray-500/20 bg-gray-500/10 text-gray-400",
      security: "border-orange-500/20 bg-orange-500/10 text-orange-400",
      performance: "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
    };
    return colors[type] ?? colors.chore;
  }

  return (
    <div className="group rounded-xl border border-white/5 bg-[#111118] p-5 transition hover:border-cyan-500/20 hover:bg-[#13131f]">
      {/* Header row */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 text-xs font-bold">
            {addr.slice(2, 4).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-white/90">{c.title}</p>
            <p className="font-mono text-xs text-white/40">{short}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {analysis && (
            <span className={`text-lg font-black tabular-nums ${scoreColor(analysis.impactScore)}`}>
              {analysis.impactScore}/10
            </span>
          )}
          <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-400">
            #{c.id}
          </span>
        </div>
      </div>

      {/* AI Analysis */}
      {loading ? (
        <div className="mt-3 h-12 animate-pulse rounded-lg bg-white/5" />
      ) : analysis ? (
        <div className="mt-3 space-y-3">
          <p className="text-sm text-white/60">{analysis.summary}</p>

          {/* Badges row */}
          <div className="flex flex-wrap gap-2">
            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${riskBadge(analysis.riskLevel)}`}>
              {analysis.riskLevel} risk
            </span>
            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${typeBadge(analysis.contributionType)}`}>
              {analysis.contributionType}
            </span>
            {analysis.isSecurityRelevant && (
              <span className="rounded-full border border-orange-500/20 bg-orange-500/10 px-2.5 py-0.5 text-xs font-medium text-orange-400">
                🔒 security relevant
              </span>
            )}
            {analysis.hasBreakingChange && (
              <span className="rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-0.5 text-xs font-medium text-red-400">
                ⚠ breaking change
              </span>
            )}
            {analysis.fixesVulnerability && (
              <span className="rounded-full border border-green-500/20 bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-400">
                🛡️ fixes vulnerability
              </span>
            )}
            {analysis.introducesVulnerability && (
              <span className="rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-0.5 text-xs font-medium text-red-400 animate-pulse">
                🚨 introduces vulnerability
              </span>
            )}
          </div>

          {/* Score bars (expanded) */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-white/30 hover:text-white/60 transition cursor-pointer"
          >
            {expanded ? "▾ Hide scores" : "▸ Show all scores"}
          </button>

          {expanded && (
            <div className="space-y-2 rounded-lg bg-white/[0.02] p-3">
              {([
                ["Impact", analysis.impactScore],
                ["Quality", analysis.qualityScore],
                ["Security", analysis.securityScore],
                ["Complexity", analysis.complexityScore],
                ["Size", analysis.sizeScore],
                ["Confidence", analysis.confidenceScore],
              ] as [string, number][]).map(([label, score]) => {
                const { pct, color } = scoreBar(score);
                return (
                  <div key={label} className="flex items-center gap-3">
                    <span className="w-20 text-xs text-white/40">{label}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${color} transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className={`w-8 text-right text-xs font-bold tabular-nums ${scoreColor(score)}`}>
                      {score}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Issues */}
          {analysis.issues && analysis.issues.length > 0 && (
            <div className="rounded-lg bg-red-500/5 border border-red-500/10 px-3 py-2 text-xs text-red-400/80">
              🐛 {analysis.issues[0]}
              {analysis.issues.length > 1 && (
                <span className="text-white/20"> +{analysis.issues.length - 1} more</span>
              )}
            </div>
          )}

          {/* Suggestions */}
          {analysis.suggestions && analysis.suggestions.length > 0 && (
            <div className="rounded-lg bg-white/[0.03] px-3 py-2 text-xs text-white/40">
              💡 {analysis.suggestions[0]}
            </div>
          )}
        </div>
      ) : null}

      {/* IPFS link */}
      <div className="mt-3 flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-xs font-mono text-white/40">
        <span className="text-cyan-400">IPFS</span>
        <a
          href={`https://gateway.pinata.cloud/ipfs/${c.ipfsCID}`}
          target="_blank"
          rel="noopener noreferrer"
          className="truncate underline decoration-white/10 hover:text-white transition"
        >
          {c.ipfsCID}
        </a>
      </div>

      {/* Timestamp */}
      <p className="mt-2 text-right text-xs text-white/20">
        {new Date(c.timestamp * 1000).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
  );
}
