"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  LayoutGrid,
  Activity,
  Trophy,
  BookOpen,
  Settings,
  Search,
  Wallet,
  ShieldCheck,
  FileText,
  Clock,
  Zap,
  Link2,
  Pin,
  Brain,
  Package,
  RefreshCw,
  FolderOpen,
  ChevronUp,
} from "lucide-react";
import { useContract } from "@/hooks/useContract";
import { ContributionCard } from "@/components/ContributionCard";
import { InteractiveBackground } from "@/components/InteractiveBackground";
import { RotatingMadeBy } from "@/components/RotatingMadeBy";

// ─── Helpers ─────────────────────────────────────────────────────
const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT ?? "";
const GEMINI_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? "";
function shortAddr(a: string) {
  return a.slice(0, 6) + "..." + a.slice(-4);
}

function repLevel(rep: number): { label: string; xpInLevel: number; xpNeeded: number } {
  if (rep >= 100) return { label: "Legend", xpInLevel: 0, xpNeeded: 0 };
  if (rep >= 50) return { label: "Expert", xpInLevel: rep - 50, xpNeeded: 50 };
  if (rep >= 20) return { label: "Builder", xpInLevel: rep - 20, xpNeeded: 30 };
  return { label: "Newcomer", xpInLevel: rep, xpNeeded: 20 };
}

type PageId = "dashboard" | "contributions" | "leaderboard" | "docs" | "settings";

// ═══════════════════════════════════════════════════════════════
//  DASHBOARD
// ═══════════════════════════════════════════════════════════════
export default function Dashboard() {
  const {
    account,
    connecting,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    reputation,
    contributions,
    isCorrectNetwork,
  } = useContract();

  const [page, setPage] = useState<PageId>("dashboard");
  const [searchQuery, setSearchQuery] = useState("");

  const level = repLevel(reputation);
  const rankProgress = level.xpNeeded > 0 ? (level.xpInLevel / level.xpNeeded) * 100 : 100;
  const archLvl = reputation >= 100 ? "∞" : reputation >= 50 ? 3 : reputation >= 20 ? 2 : 1;

  // Leaderboard: aggregate by contributor
  const leaderboard = useMemo(() => {
    const byAddr: Record<string, { addr: string; commits: number; rep: number }> = {};
    contributions.forEach((c) => {
      const a = c.contributor.toLowerCase();
      if (!byAddr[a]) byAddr[a] = { addr: c.contributor, commits: 0, rep: 0 };
      byAddr[a].commits += 1;
      byAddr[a].rep += 10;
    });
    return Object.values(byAddr)
      .sort((a, b) => b.rep - a.rep)
      .slice(0, 20);
  }, [contributions]);

  // Filter contributions by search
  const filteredContributions = useMemo(() => {
    if (!searchQuery.trim()) return contributions;
    const q = searchQuery.toLowerCase();
    return contributions.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.contributor.toLowerCase().includes(q) ||
        c.ipfsCID.toLowerCase().includes(q),
    );
  }, [contributions, searchQuery]);

  // Status indicators
  const hasRpc = true;
  const hasIpfs = !!PINATA_JWT;
  const hasGemini = !!GEMINI_KEY;

  return (
    <div className="min-h-screen bg-background text-foreground flex relative">
      <InteractiveBackground />

      {/* ─── SIDEBAR ───────────────────────────────────────────────── */}
      <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-border/30 bg-secondary/20 backdrop-blur-md">
        <div className="flex items-center gap-3 p-4 border-b border-border/20">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
            <ShieldCheck className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-foreground">
            Commit<span className="text-primary">Chain</span>
          </span>
        </div>

        <nav className="flex flex-1 flex-col overflow-y-auto p-3 space-y-1">
          {[
            { id: "dashboard" as const, icon: LayoutGrid, label: "DASHBOARD" },
            { id: "contributions" as const, icon: Activity, label: "MY CONTRIBUTION" },
            { id: "leaderboard" as const, icon: Trophy, label: "RANKINGS" },
            { id: "docs" as const, icon: BookOpen, label: "DOCUMENTATIONS" },
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setPage(id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                page === id
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {label}
            </button>
          ))}

          {account && (
            <div className="mt-4 rounded-xl border border-border/30 bg-secondary/30 p-3">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Your Reputation
              </div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-foreground">Lvl {archLvl} {level.label}</span>
                <span className="text-muted-foreground">{reputation} XP</span>
              </div>
              <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all"
                  style={{ width: `${rankProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="mt-auto border-t border-border/20 pt-3 space-y-3">
            <div className="rounded-xl border border-primary/30 bg-secondary/30 p-3 shadow-glow-primary">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Architect Lvl {archLvl}
                </span>
                <Trophy className="h-4 w-4 text-primary" />
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                <span>Next Rank</span>
                <span>{level.xpNeeded === 0 ? "Max" : `${level.xpInLevel} / ${level.xpNeeded} XP`}</span>
              </div>
              <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all"
                  style={{ width: `${rankProgress}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => setPage("settings")}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                page === "settings"
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              }`}
            >
              <Settings className="h-5 w-5 shrink-0" />
              SETTINGS
            </button>
          </div>
        </nav>
      </aside>

      {/* ─── MAIN ─────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col pl-64 min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border/20 bg-background/90 backdrop-blur-md px-6">
          <div className="flex flex-1 max-w-md items-center gap-2 rounded-lg border border-border/30 bg-secondary/20 px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ledger..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex items-center gap-3">
            {!isCorrectNetwork && account && (
              <button
                onClick={switchNetwork}
                className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive"
              >
                Switch to Polygon Amoy
              </button>
            )}
            {account ? (
              <div className="flex items-center gap-2 rounded-lg border border-border/30 bg-secondary/20 px-3 py-2">
                <span className="text-xs text-muted-foreground">Polygon Amoy</span>
                <span className="font-mono text-sm text-foreground">{shortAddr(account)}</span>
                <button
                  onClick={disconnectWallet}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                disabled={connecting}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-bold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
              >
                <Wallet className="h-4 w-4" />
                {connecting ? "Connecting…" : "Connect Wallet"}
              </button>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 relative z-10">
          {/* ─── PAGE: DASHBOARD ───────────────────────────────────── */}
          {page === "dashboard" && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-border/30 bg-secondary/20 p-5 hover:border-primary/40 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground leading-tight">
                      Total Proof of<br />Work
                    </span>
                    <Activity className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{contributions.length}</div>
                  <div className="text-xs text-muted-foreground mt-1">contributions</div>
                </div>
                <div className="rounded-xl border border-border/30 bg-secondary/20 p-5 hover:border-primary/40 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground leading-tight">
                      Verified<br />Commits
                    </span>
                    <ShieldCheck className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{contributions.length}</div>
                  <div className="text-xs text-muted-foreground mt-1">on-chain</div>
                </div>
                <div className="rounded-xl border border-border/30 bg-secondary/20 p-5 hover:border-primary/40 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground leading-tight">
                      IPFS<br />Storage
                    </span>
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{contributions.length}</div>
                  <div className="text-xs text-muted-foreground mt-1">pinned</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-bold">
                  <Clock className="h-5 w-5 text-primary" />
                  Recent Proof of Work
                </h2>
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary">
                  Live Updates
                </span>
              </div>

              {filteredContributions.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-muted-foreground">
                  <Zap className="h-12 w-12 text-primary mb-4" />
                  <div className="font-medium">No contributions yet</div>
                  <div className="text-sm mt-1">Submit your first contribution or configure the contract in Settings.</div>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredContributions.slice(0, 10).map((c) => (
                    <ContributionCard key={c.id} c={c} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ─── PAGE: CONTRIBUTIONS ────────────────────────────────── */}
          {page === "contributions" && (
            <div className="space-y-6">
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <Zap className="h-5 w-5 text-primary" />
                Contribution Feed
              </h2>
              {filteredContributions.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-muted-foreground">
                  <Package className="h-12 w-12 text-primary mb-4" />
                  <div className="font-medium">No contributions found</div>
                  <div className="text-sm mt-1">Be the first to submit a verified contribution.</div>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredContributions.map((c) => (
                    <ContributionCard key={c.id} c={c} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ─── PAGE: LEADERBOARD ──────────────────────────────────── */}
          {page === "leaderboard" && (
            <div className="space-y-6">
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <Trophy className="h-5 w-5 text-primary" />
                Top Contributors
              </h2>
              <div className="rounded-xl border border-border/30 bg-secondary/20 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/30">
                      <th className="px-4 py-3 text-left font-semibold text-foreground">Rank</th>
                      <th className="px-4 py-3 text-left font-semibold text-foreground">Address</th>
                      <th className="px-4 py-3 text-left font-semibold text-foreground">Reputation</th>
                      <th className="px-4 py-3 text-left font-semibold text-foreground">Commits</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-12 text-center text-muted-foreground">
                          No contributors yet
                        </td>
                      </tr>
                    ) : (
                      leaderboard.map((row, i) => (
                        <tr key={row.addr} className="border-b border-border/20 hover:bg-secondary/30 transition">
                          <td className="px-4 py-3 font-mono text-muted-foreground">{i + 1}</td>
                          <td className="px-4 py-3">
                            <a
                              href={`https://amoy.polygonscan.com/address/${row.addr}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono text-primary hover:underline"
                            >
                              {shortAddr(row.addr)}
                            </a>
                          </td>
                          <td className="px-4 py-3 font-bold text-primary">{row.rep}</td>
                          <td className="px-4 py-3 text-muted-foreground">{row.commits}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── PAGE: DOCS ─────────────────────────────────────────── */}
          {page === "docs" && (
            <div className="space-y-8 max-w-3xl">
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <BookOpen className="h-5 w-5 text-primary" />
                CommitChain CLI
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Submit verifiable code contributions on-chain with AI analysis and IPFS proof. Extracts git diff, analyzes with Gemini, uploads to IPFS, records on Polygon.
              </p>

              <h2 className="flex items-center gap-2 text-lg font-bold">
                <Package className="h-5 w-5 text-primary" />
                Installation
              </h2>
              <div className="rounded-xl border border-border/30 bg-secondary/30 p-4 font-mono text-xs text-muted-foreground">
                <span className="text-primary"># Install globally</span>
                <br />
                npm install -g @commitchain/cli
                <br /><br />
                <span className="text-primary"># Verify</span>
                <br />
                commitchain --version
              </div>

              <h2 className="flex items-center gap-2 text-lg font-bold">
                <Zap className="h-5 w-5 text-primary" />
                Submit a Contribution
              </h2>
              <div className="rounded-xl border border-border/30 bg-secondary/30 p-4 font-mono text-xs text-muted-foreground">
                <span className="text-primary">commitchain submit</span> <span className="text-accent">--title</span> <span className="text-foreground">&quot;Your change title&quot;</span> <span className="text-accent">--private-key</span> <span className="text-foreground">&quot;YOUR_PRIVATE_KEY&quot;</span>
              </div>

              <h2 className="flex items-center gap-2 text-lg font-bold">
                <RefreshCw className="h-5 w-5 text-primary" />
                How the Flow Works
              </h2>
              <div className="rounded-xl border border-border/30 bg-secondary/30 p-4 font-mono text-xs text-muted-foreground space-y-1">
                <div><span className="text-primary"># 1.</span> Extract git diff from current repo</div>
                <div><span className="text-primary"># 2.</span> Analyze changes using AI (Gemini)</div>
                <div><span className="text-primary"># 3.</span> Upload report to IPFS (Pinata)</div>
                <div><span className="text-primary"># 4.</span> Record contribution on-chain</div>
                <div><span className="text-primary"># 5.</span> Earn +10 reputation</div>
              </div>

              <h2 className="flex items-center gap-2 text-lg font-bold">
                <FolderOpen className="h-5 w-5 text-primary" />
                Architecture
              </h2>
              <div className="rounded-xl border border-border/30 bg-secondary/30 p-4 font-mono text-xs text-muted-foreground whitespace-pre">
{`CLI (Node.js)
   ├── simple-git → Extract diff
   ├── Gemini API → AI analysis
   ├── Pinata API → IPFS upload
   └── ethers.js → Blockchain tx (Polygon)`}
              </div>

              <Link
                href="/docs"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-bold text-primary-foreground text-sm hover:opacity-90"
              >
                Full Documentation <ChevronUp className="h-4 w-4 rotate-90" />
              </Link>
            </div>
          )}

          {/* ─── PAGE: SETTINGS ────────────────────────────────────── */}
          {page === "settings" && (
            <div className="space-y-6">
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <Settings className="h-5 w-5 text-primary" />
                Configuration
              </h2>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-xl border border-border/30 bg-secondary/20 p-5">
                  <h3 className="flex items-center gap-2 text-sm font-bold mb-4">
                    <Link2 className="h-4 w-4 text-primary" />
                    Blockchain
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="mb-1 block text-xs text-muted-foreground">Contract Address</label>
                      <input
                        type="text"
                        defaultValue={process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? "0x0B1b8155545a3A63C163bf21C5dD70596Fe9A32C"}
                        readOnly
                        className="w-full rounded-lg border border-border/30 bg-secondary/30 px-3 py-2 text-xs font-mono text-muted-foreground"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-muted-foreground">RPC URL</label>
                      <input
                        type="text"
                        defaultValue={process.env.NEXT_PUBLIC_RPC_URL ?? "https://rpc-amoy.polygon.technology"}
                        readOnly
                        className="w-full rounded-lg border border-border/30 bg-secondary/30 px-3 py-2 text-xs font-mono text-muted-foreground"
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-border/30 bg-secondary/20 p-5">
                  <h3 className="flex items-center gap-2 text-sm font-bold mb-4">
                    <Pin className="h-4 w-4 text-primary" />
                    IPFS (Pinata)
                  </h3>
                  <div>
                    <label className="mb-1 block text-xs text-muted-foreground">Pinata JWT</label>
                    <input
                      type="password"
                      placeholder={hasIpfs ? "••••••••••" : "Configure in .env"}
                      readOnly
                      className="w-full rounded-lg border border-border/30 bg-secondary/30 px-3 py-2 text-xs text-muted-foreground"
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-border/30 bg-secondary/20 p-5">
                  <h3 className="flex items-center gap-2 text-sm font-bold mb-4">
                    <Brain className="h-4 w-4 text-primary" />
                    AI (Gemini)
                  </h3>
                  <div>
                    <label className="mb-1 block text-xs text-muted-foreground">Gemini API Key</label>
                    <input
                      type="password"
                      placeholder={hasGemini ? "••••••••••" : "Configure in .env"}
                      readOnly
                      className="w-full rounded-lg border border-border/30 bg-secondary/30 px-3 py-2 text-xs text-muted-foreground"
                    />
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                Configure API keys in <code className="text-primary text-xs">.env</code> (NEXT_PUBLIC_PINATA_JWT, NEXT_PUBLIC_GEMINI_API_KEY).
              </p>
            </div>
          )}
        </main>

        {/* Status bar */}
        <footer className="flex items-center justify-center gap-8 border-t border-border/30 bg-secondary/20 py-3 px-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${hasRpc ? "bg-primary" : "bg-yellow-500"}`} />
            POLYGON AMOY
          </div>
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${hasIpfs ? "bg-primary" : "bg-yellow-500"}`} />
            PINATA IPFS
          </div>
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${hasGemini ? "bg-primary" : "bg-yellow-500"}`} />
            GEMINI AI
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            COMMITCHAIN CLI
          </div>
          <RotatingMadeBy />
        </footer>
      </div>
    </div>
  );
}
