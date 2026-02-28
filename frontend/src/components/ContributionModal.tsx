"use client";

import { useEffect } from "react";
import type { OnChainContribution } from "@/hooks/useContract";

// ═══════════════════════════════════════════════════════════════
//  TYPES (shared with ContributionCard)
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

export interface IPFSPayload {
  title: string;
  diff: string;
  analysis: AIAnalysis;
  contributor: string;
  timestamp: number;
  gitBranch?: string;
  message?: string;
}

interface Props {
  contribution: OnChainContribution;
  payload: IPFSPayload | null;
  onClose: () => void;
}

// ═══════════════════════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════════════════════

function scoreColor(score: number) {
  if (score >= 8) return "text-green-400";
  if (score >= 5) return "text-cyan-400";
  if (score >= 3) return "text-yellow-400";
  return "text-red-400";
}

function scoreBg(score: number) {
  if (score >= 8) return "bg-green-500";
  if (score >= 5) return "bg-cyan-500";
  if (score >= 3) return "bg-yellow-500";
  return "bg-red-500";
}

function riskStyle(risk: string) {
  const m: Record<string, { bg: string; text: string; border: string }> = {
    low: { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/20" },
    medium: { bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/20" },
    high: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/20" },
    critical: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20" },
  };
  return m[risk] ?? m.medium;
}

function typeStyle(type: string) {
  const m: Record<string, string> = {
    bugfix: "border-red-500/20 bg-red-500/10 text-red-400",
    feature: "border-purple-500/20 bg-purple-500/10 text-purple-400",
    refactor: "border-blue-500/20 bg-blue-500/10 text-blue-400",
    docs: "border-gray-500/20 bg-gray-500/10 text-gray-400",
    test: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    chore: "border-gray-500/20 bg-gray-500/10 text-gray-400",
    security: "border-orange-500/20 bg-orange-500/10 text-orange-400",
    performance: "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
  };
  return m[type] ?? m.chore;
}

function overallGrade(a: AIAnalysis): { letter: string; color: string } {
  const avg = (a.impactScore + a.qualityScore + (10 - a.securityScore) + a.complexityScore) / 4;
  if (avg >= 8) return { letter: "A", color: "text-green-400" };
  if (avg >= 6) return { letter: "B", color: "text-cyan-400" };
  if (avg >= 4) return { letter: "C", color: "text-yellow-400" };
  if (avg >= 2) return { letter: "D", color: "text-orange-400" };
  return { letter: "F", color: "text-red-400" };
}

// ═══════════════════════════════════════════════════════════════
//  MODAL
// ═══════════════════════════════════════════════════════════════

export function ContributionModal({ contribution: c, payload, onClose }: Props) {
  const analysis = payload?.analysis;
  const addr = c.contributor;
  const short = addr.slice(0, 6) + "..." + addr.slice(-4);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const scores: [string, string, number][] = analysis
    ? [
        ["Impact", "⚡", analysis.impactScore],
        ["Quality", "✨", analysis.qualityScore],
        ["Security", "🔒", analysis.securityScore],
        ["Complexity", "🧩", analysis.complexityScore],
        ["Size", "📏", analysis.sizeScore],
        ["Confidence", "🎯", analysis.confidenceScore],
      ]
    : [];

  const grade = analysis ? overallGrade(analysis) : null;
  const risk = analysis ? riskStyle(analysis.riskLevel) : null;

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal panel */}
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0d0d14] shadow-2xl shadow-cyan-500/5">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/40 hover:bg-white/10 hover:text-white transition z-10"
        >
          ✕
        </button>

        {/* ─── HEADER ─────────────────────────────────────────── */}
        <div className="border-b border-white/5 p-6 pb-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 text-sm font-bold shrink-0">
              {addr.slice(2, 4).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-bold text-white leading-tight">{c.title}</h2>
              <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-white/40">
                <span className="font-mono">{short}</span>
                <span>·</span>
                <span>
                  {new Date(c.timestamp * 1000).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span>·</span>
                <span className="text-cyan-400 font-semibold">#{c.id}</span>
                {payload?.gitBranch && (
                  <>
                    <span>·</span>
                    <span className="text-purple-400">🌿 {payload.gitBranch}</span>
                  </>
                )}
              </div>
            </div>
            {grade && (
              <div className="flex flex-col items-center shrink-0">
                <span className={`text-4xl font-black ${grade.color}`}>{grade.letter}</span>
                <span className="text-[10px] text-white/30 uppercase tracking-wider">Grade</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* ─── CONTRIBUTOR INFO ──────────────────────────────── */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/30 mb-3">Contributor</h3>
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/50">Wallet Address</span>
                <a
                  href={`https://amoy.polygonscan.com/address/${addr}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-sm text-cyan-400 hover:text-cyan-300 transition"
                >
                  {addr}
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/50">IPFS CID</span>
                <a
                  href={`https://gateway.pinata.cloud/ipfs/${c.ipfsCID}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-sm text-cyan-400 hover:text-cyan-300 transition truncate max-w-[300px]"
                >
                  {c.ipfsCID}
                </a>
              </div>
              {payload?.message && (
                <div className="flex items-start justify-between">
                  <span className="text-sm text-white/50">Message</span>
                  <span className="text-sm text-white/70 text-right max-w-[300px]">{payload.message}</span>
                </div>
              )}
            </div>
          </section>

          {/* ─── AI SUMMARY ───────────────────────────────────── */}
          {analysis && (
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/30 mb-3">AI Analysis Summary</h3>
              <p className="text-sm text-white/70 leading-relaxed">{analysis.summary}</p>

              {/* Badges */}
              <div className="mt-3 flex flex-wrap gap-2">
                {risk && (
                  <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${risk.bg} ${risk.text} ${risk.border}`}>
                    {analysis.riskLevel.toUpperCase()} RISK
                  </span>
                )}
                <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${typeStyle(analysis.contributionType)}`}>
                  {analysis.contributionType.toUpperCase()}
                </span>
                {analysis.isSecurityRelevant && (
                  <span className="rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-400">
                    🔒 SECURITY RELEVANT
                  </span>
                )}
                {analysis.hasBreakingChange && (
                  <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400">
                    ⚠ BREAKING CHANGE
                  </span>
                )}
                {analysis.fixesVulnerability && (
                  <span className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
                    🛡️ FIXES VULNERABILITY
                  </span>
                )}
                {analysis.introducesVulnerability && (
                  <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400 animate-pulse">
                    🚨 INTRODUCES VULNERABILITY
                  </span>
                )}
                {analysis.hasSecurityRisk && (
                  <span className="rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-400">
                    ⚠ SECURITY RISK
                  </span>
                )}
              </div>
            </section>
          )}

          {/* ─── CODE QUALITY REPORT ──────────────────────────── */}
          {analysis && (
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/30 mb-3">Code Quality Report</h3>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 space-y-3">
                {scores.map(([label, icon, score]) => {
                  const pct = Math.round((score / 10) * 100);
                  return (
                    <div key={label}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-white/50">{icon} {label}</span>
                        <span className={`text-sm font-bold tabular-nums ${scoreColor(score)}`}>{score}/10</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${scoreBg(score)} transition-all duration-700`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}

                {/* Overall average */}
                <div className="border-t border-white/5 pt-3 mt-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-white/60">Overall Average</span>
                  <span className={`text-lg font-black tabular-nums ${grade?.color}`}>
                    {(scores.reduce((s, [, , v]) => s + v, 0) / scores.length).toFixed(1)}/10
                  </span>
                </div>
              </div>
            </section>
          )}

          {/* ─── ISSUES ───────────────────────────────────────── */}
          {analysis?.issues && analysis.issues.length > 0 && (
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/30 mb-3">
                Issues Found ({analysis.issues.length})
              </h3>
              <div className="space-y-2">
                {analysis.issues.map((issue, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-lg border border-red-500/10 bg-red-500/5 px-4 py-3"
                  >
                    <span className="text-red-400 shrink-0 mt-0.5">🐛</span>
                    <p className="text-sm text-red-400/90">{issue}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ─── SUGGESTIONS ──────────────────────────────────── */}
          {analysis?.suggestions && analysis.suggestions.length > 0 && (
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/30 mb-3">
                Suggestions ({analysis.suggestions.length})
              </h3>
              <div className="space-y-2">
                {analysis.suggestions.map((s, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-lg border border-cyan-500/10 bg-cyan-500/5 px-4 py-3"
                  >
                    <span className="text-cyan-400 shrink-0 mt-0.5">💡</span>
                    <p className="text-sm text-white/60">{s}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ─── DIFF PREVIEW ─────────────────────────────────── */}
          {payload?.diff && (
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/30 mb-3">Diff Preview</h3>
              <div className="rounded-xl border border-white/5 bg-black/40 overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/5 px-4 py-2">
                  <span className="text-xs text-white/30 font-mono">
                    {payload.diff.split("\n").length} lines
                  </span>
                  <button
                    onClick={() => navigator.clipboard.writeText(payload.diff)}
                    className="text-xs text-white/30 hover:text-white/60 transition"
                  >
                    📋 Copy
                  </button>
                </div>
                <pre className="p-4 text-xs font-mono leading-relaxed overflow-x-auto max-h-80 text-white/60">
                  {payload.diff.split("\n").map((line, i) => {
                    let lineClass = "text-white/40";
                    if (line.startsWith("+") && !line.startsWith("+++")) lineClass = "text-green-400/80";
                    else if (line.startsWith("-") && !line.startsWith("---")) lineClass = "text-red-400/80";
                    else if (line.startsWith("@@")) lineClass = "text-cyan-400/60";
                    else if (line.startsWith("diff ") || line.startsWith("index ")) lineClass = "text-purple-400/50";
                    return (
                      <div key={i} className={`${lineClass} hover:bg-white/[0.03] px-1 -mx-1 rounded`}>
                        {line || " "}
                      </div>
                    );
                  })}
                </pre>
              </div>
            </section>
          )}

          {/* ─── LINKS ────────────────────────────────────────── */}
          <section className="flex flex-wrap gap-3 pt-2">
            <a
              href={`https://gateway.pinata.cloud/ipfs/${c.ipfsCID}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/60 hover:text-white hover:border-cyan-500/30 transition"
            >
              📌 View on IPFS
            </a>
            <a
              href={`https://amoy.polygonscan.com/address/${addr}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/60 hover:text-white hover:border-cyan-500/30 transition"
            >
              🔍 View on Explorer
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}
