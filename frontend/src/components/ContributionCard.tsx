"use client";

import { useState, useEffect } from "react";
import {
  AlertOctagon,
  AlertTriangle,
  Bug,
  Lightbulb,
  Lock,
  ShieldCheck,
} from "lucide-react";
import type { OnChainContribution } from "@/hooks/useContract";
import { ContributionModal } from "./ContributionModal";

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
  const [modalOpen, setModalOpen] = useState(false);

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
    <>
    <div
      className="group rounded-xl border border-border/30 bg-secondary/20 p-5 transition hover:border-primary/40 hover:bg-secondary/30 cursor-pointer"
      onClick={() => setModalOpen(true)}
    >
      {/* Header row */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-bold text-primary-foreground">
            {addr.slice(2, 4).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-foreground">{c.title}</p>
            <p className="font-mono text-xs text-muted-foreground">{short}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {analysis && (
            <span className={`text-lg font-black tabular-nums ${scoreColor(analysis.impactScore)}`}>
              {analysis.impactScore}/10
            </span>
          )}
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
            #{c.id}
          </span>
        </div>
      </div>

      {/* AI Analysis */}
      {loading ? (
        <div className="mt-3 h-12 animate-pulse rounded-lg bg-secondary" />
      ) : analysis ? (
        <div className="mt-3 space-y-3">
          <p className="text-sm text-muted-foreground">{analysis.summary}</p>

          {/* Badges row */}
          <div className="flex flex-wrap gap-2">
            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${riskBadge(analysis.riskLevel)}`}>
              {analysis.riskLevel} risk
            </span>
            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${typeBadge(analysis.contributionType)}`}>
              {analysis.contributionType}
            </span>
            {analysis.isSecurityRelevant && (
              <span className="inline-flex items-center gap-1 rounded-full border border-orange-500/20 bg-orange-500/10 px-2.5 py-0.5 text-xs font-medium text-orange-400">
                <Lock className="w-3 h-3" />
                <span>security relevant</span>
              </span>
            )}
            {analysis.hasBreakingChange && (
              <span className="inline-flex items-center gap-1 rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-0.5 text-xs font-medium text-red-400">
                <AlertTriangle className="w-3 h-3" />
                <span>breaking change</span>
              </span>
            )}
            {analysis.fixesVulnerability && (
              <span className="inline-flex items-center gap-1 rounded-full border border-green-500/20 bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-400">
                <ShieldCheck className="w-3 h-3" />
                <span>fixes vulnerability</span>
              </span>
            )}
            {analysis.introducesVulnerability && (
              <span className="inline-flex items-center gap-1 rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-0.5 text-xs font-medium text-red-400 animate-pulse">
                <AlertOctagon className="w-3 h-3" />
                <span>introduces vulnerability</span>
              </span>
            )}
          </div>

          {/* Score bars (expanded) */}
          <button
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
            className="text-xs text-muted-foreground hover:text-foreground transition cursor-pointer"
          >
            {expanded ? "▾ Hide scores" : "▸ Show all scores"}
          </button>

          {expanded && (
            <div className="space-y-2 rounded-lg bg-secondary/30 p-3">
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
                    <span className="w-20 text-xs text-muted-foreground">{label}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
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
            <div className="flex items-start gap-2 rounded-lg bg-red-500/5 border border-red-500/10 px-3 py-2 text-xs text-red-400/80">
              <Bug className="w-3 h-3 mt-0.5" />
              <span>
                {analysis.issues[0]}
                {analysis.issues.length > 1 && (
                  <span className="text-muted-foreground/60">
                    {" "}
                    +{analysis.issues.length - 1} more
                  </span>
                )}
              </span>
            </div>
          )}

          {/* Suggestions */}
          {analysis.suggestions && analysis.suggestions.length > 0 && (
            <div className="flex items-start gap-2 rounded-lg bg-secondary/30 px-3 py-2 text-xs text-muted-foreground">
              <Lightbulb className="w-3 h-3 mt-0.5 text-primary" />
              <span>{analysis.suggestions[0]}</span>
            </div>
          )}
        </div>
      ) : null}

      {/* IPFS link */}
      <div className="mt-3 flex items-center gap-2 rounded-lg bg-secondary/30 px-3 py-2 text-xs font-mono text-muted-foreground">
        <span className="text-primary">IPFS</span>
        <a
          href={`https://gateway.pinata.cloud/ipfs/${c.ipfsCID}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="truncate underline decoration-border hover:text-foreground transition"
        >
          {c.ipfsCID}
        </a>
      </div>

      {/* Timestamp */}
      <p className="mt-2 text-right text-xs text-muted-foreground">
        {new Date(c.timestamp * 1000).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>

    {/* Detail Modal */}
    {modalOpen && (
      <ContributionModal
        contribution={c}
        payload={payload}
        onClose={() => setModalOpen(false)}
      />
    )}
    </>
  );
}
