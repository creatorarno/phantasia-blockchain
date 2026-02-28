"use client";

import { useState, useEffect } from "react";
import type { OnChainContribution } from "@/hooks/useContract";

// ═══════════════════════════════════════════════════════════════
//  IPFS Payload (matches what CLI pins)
// ═══════════════════════════════════════════════════════════════

interface AIAnalysis {
  summary: string;
  impactScore: number;
  riskLevel: string;
  contributionType: string;
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

  // Impact score color
  function scoreColor(score: number) {
    if (score >= 8) return "text-green-400";
    if (score >= 5) return "text-cyan-400";
    if (score >= 3) return "text-yellow-400";
    return "text-red-400";
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
        <div className="mt-3 space-y-2">
          <p className="text-sm text-white/60">{analysis.summary}</p>
          <div className="flex flex-wrap gap-2">
            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${riskBadge(analysis.riskLevel)}`}>
              {analysis.riskLevel} risk
            </span>
            <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-2.5 py-0.5 text-xs font-medium text-purple-400">
              {analysis.contributionType}
            </span>
          </div>
          {analysis.suggestions.length > 0 && (
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
