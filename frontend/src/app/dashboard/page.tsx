"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import { useContract } from "@/hooks/useContract";
import { ContributionCard } from "@/components/ContributionCard";
import { Wallet, RefreshCw, Bell, Settings, AlertTriangle, CheckCircle2, Terminal, ShieldCheck, Network, Database, ChevronDown, Link2, Shield, ExternalLink, Compass, Hourglass, ChevronUp, History, Github, Star, Code2 } from "lucide-react";

// ─── Identicon image URLs (rotating set) ─────────────────────────
const IDENTICONS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDu7_Iq3V5WY5VHFf-TNxZ6d8i6_TzdkcZN9eZ0Qxbo-8OPSf1OGy4fQWFJP2fbF_poV2DcJHIh54z-ukU0aLOpSjG1iNTdhkIAKN6XyZ1u9Ja26tORCpAGH0LxozRgSDgKCaTxJmHbA96vWmN6tjt2tpCLAo4JueFsLsEYMeXKLOZzLS_JRQYQ6fIyEXQiny_s5JoMlqAyYaqhzUTGyRptYJ4GpK2KOT_pUg3PQ_R1_j8eEdKQbhuKCur_FIyndHqq7BTvHF8C_A8",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCE34nAV4n5mxT4sdPGV489rTgeaewZOUCmd1K-fSDyPCi2QCNzZU6iPzCFb_oiT1b8FN3TvPlDmXBvV7L4BP9jTDdn9Ljru0u90Sqo8CJ1LWS_zeymIdS9pXfDFNffWHOwo4flP5LatQysnsSQV60CGUhypPxgNgYW5hPAZelxfAWl9BTPRsuHAJOPAfgCbGRJaMNa5Tt4dqN9sD1OhQAKrilClzD-y6AGgue8q7sj1nO833h9NKYMNzQZfhdwu191cOCgvpLUfB4",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBzkMs961sziiTm0pVdGYMOF03Lw4JD8QixqkAXEwKhPHUqh9GDIMVGvKFcBTvtgt-ubbH0JFwVFkr0Kw9Y2dtjfPlLuWC4Br_wRJ9BqnfE0LICR3jsJKp5wlVQi5uI96BrJvJeJE5B8u21Uk0O_JYpdzqETkFlPIDwKCIJ1gQ31WZUFp6lOVQbJnUViIdpZs3Byc_xp7qFTRP8VbGaqFADk1wUtn2AvzDGDT4AJlEzPPJBwqorYFF0C60EyO2GO0keW9IJBNM2rBc",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCNip2IzyOxJvmb6LJFWO7q1TAd3kpxkO3XN1J6F7nrScqEwTUGQKjFFg9oA70n0UCJUWJpEkluj7ir6qPtFSwJlLNk9Gxas8J4o1IUT0itkzO5DMdIc6HPlBKDughe4VzN8eCABynjV791y_s4GJJxkfi_54j-6re1IUkc5D_zZbg0_5GXDeiRwEIPfZf9gKKvq3Pg23wKMG9tV6RGM8fL67tRAwAweWV08euuYh_eWJvwZXguzn4EaEun3WuEvIPiyyZo91yqrJk",
];

function shortAddr(a: string) {
  return a.slice(0, 6) + "..." + a.slice(-4);
}

function relativeTime(timestamp: number): string {
  const diff = Math.floor(Date.now() / 1000) - timestamp;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 172800) return "Yesterday";
  return `${Math.floor(diff / 86400)}d ago`;
}

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
    submitContribution,
    submitting,
    txHash,
    error,
    refreshData,
    isCorrectNetwork,
  } = useContract();

  const { user: githubUser, loginWithGitHub } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [sortNewest, setSortNewest] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const totalContributions = contributions.length;
  const networkNodes = useMemo(() => {
    const unique = new Set(contributions.map((c) => c.contributor.toLowerCase()));
    return unique.size + 340; // Base network size
  }, [contributions]);

  const sortedContributions = useMemo(() => {
    const sorted = [...contributions];
    return sortNewest ? sorted : sorted.reverse();
  }, [contributions, sortNewest]);

  const displayedContributions = showAll
    ? sortedContributions
    : sortedContributions.slice(0, 4);

  async function handleSubmit() {
    if (!title.trim() || !githubUrl.trim()) return;
    // Use the github URL as the IPFS CID placeholder until real AI/IPFS flow runs
    await submitContribution(title.trim(), githubUrl.trim());
    if (!error) {
      setTitle("");
      setDescription("");
      setGithubUrl("");
    }
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body relative">
      {/* ─── Background ambient glows ─────────────────────────── */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary/5 blur-[120px] rounded-full" />
      </div>

      {/* ─── TOP NAVBAR ───────────────────────────────────────── */}
      <nav className="bg-[#131315]/80 backdrop-blur-xl sticky top-0 z-50 shadow-[0_4px_20px_rgba(124,58,237,0.04)]">
        <div className="flex justify-between items-center w-full px-4 sm:px-8 py-3 sm:py-4 max-w-[1440px] mx-auto">
          {/* Left: Logo + Nav Links */}
          <div className="flex items-center gap-6 sm:gap-8">
            <Link href="/" className="text-xl sm:text-2xl font-bold tracking-tighter text-primary italic font-headline hover:text-primary/80 transition-colors">
              CommitChain
            </Link>
            <div className="hidden md:flex gap-6 items-center">
              <Link className="text-primary border-b-2 border-primary pb-1 font-label text-sm" href="/dashboard">
                Dashboard
              </Link>
              
              <Link className="text-on-surface-variant hover:text-primary transition-colors font-label text-sm" href="/docs">
                Docs
              </Link>
            </div>
          </div>

          {/* Center: Network indicator (absolute) */}
          <div className="absolute left-1/2 -translate-x-1/2 hidden sm:flex items-center gap-2 px-4 py-1.5 bg-surface-container-low rounded-full border border-outline-variant/20">
            <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
            <span className="font-mono text-xs text-on-surface-variant tracking-wide">
              Polygon Amoy Testnet
            </span>
          </div>

          {/* Right: Wallet + Actions */}
          <div className="flex items-center gap-2 sm:gap-4">

            {!isCorrectNetwork && account && (
              <button
                onClick={switchNetwork}
                className="hidden sm:block px-3 py-1.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-xs font-semibold transition hover:bg-red-500/20"
              >
                Switch Network
              </button>
            )}

            {account ? (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-low border border-outline-variant/10 rounded-lg hover:bg-surface-container-highest transition-all cursor-pointer"
                onClick={disconnectWallet}
              >
                <span className="font-mono text-xs text-primary">{shortAddr(account)}</span>
                <Wallet className="text-sm text-on-surface-variant" />
              </div>
            ) : (
              <button
                onClick={connectWallet}
                disabled={connecting}
                className="flex items-center gap-2 bg-gradient-to-br from-primary to-primary-container text-on-primary px-4 py-2 rounded-lg font-bold text-sm transition-all active:scale-95 disabled:opacity-50"
              >
                <Wallet className="text-sm" />
                {connecting ? "Connecting…" : "Connect Wallet"}
              </button>
            )}

            <div className="hidden sm:flex items-center gap-1">
              <button
                className="p-2 text-on-surface-variant hover:bg-surface-container-highest/50 rounded-lg transition-all duration-300"
                onClick={refreshData}
                title="Refresh data"
              >
                <RefreshCw className="text-xl" />
              </button>
              <button className="p-2 text-on-surface-variant hover:bg-surface-container-highest/50 rounded-lg transition-all duration-300">
                <Bell className="text-xl" />
              </button>
              <button className="p-2 text-on-surface-variant hover:bg-surface-container-highest/50 rounded-lg transition-all duration-300">
                <Settings className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ─── MAIN CONTENT ────────────────────────────────────── */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-8 pt-6 sm:pt-8 pb-20">

        {/* Error banner */}
        {error && (
          <div className="mb-6 flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            <AlertTriangle className="text-base" />
            {error}
          </div>
        )}

        {/* TX hash success */}
        {txHash && (
          <div className="mb-6 flex items-center gap-3 px-4 py-3 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary text-sm">
            <CheckCircle2 className="text-base" />
            Submitted! Tx:{" "}
            <a
              href={`https://amoy.polygonscan.com/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono underline hover:text-secondary/80"
            >
              {txHash.slice(0, 10)}...{txHash.slice(-8)}
            </a>
          </div>
        )}

        {/* ─── STAT BAR ──────────────────────────────────────── */}
        <div className="glass-panel rounded-2xl mb-8 sm:mb-12 overflow-hidden border border-white/5 shadow-2xl">
          <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-white/5">

            {/* Metric 1: Contributions */}
            <div className="flex-1 p-5 sm:p-8 group hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center gap-2 mb-4">
                <Terminal className="text-primary text-lg" />
                <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-[0.2em]">
                  System.Contributions
                </span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-bold font-headline tracking-tighter text-on-surface">
                  {totalContributions.toLocaleString()}
                </span>
                {totalContributions > 0 && (
                  <span className="text-secondary font-mono text-xs font-semibold px-2 py-0.5 bg-secondary/10 rounded-sm">
                    <span className="inline-block translate-y-px">▲</span> Live
                  </span>
                )}
              </div>
              <div className="mt-4 sm:mt-6 flex items-center gap-2">
                <div className="flex-1 h-[2px] bg-white/5 overflow-hidden">
                  <div
                    className="h-full bg-primary shadow-[0_0_10px_#d2bbff]"
                    style={{ width: totalContributions > 0 ? "66%" : "0%" }}
                  />
                </div>
                <span className="text-[9px] font-mono text-outline-variant">LIFETIME_LOG</span>
              </div>
            </div>

            {/* Metric 2: Reputation */}
            <div className="flex-1 p-5 sm:p-8 group hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="text-secondary text-lg" />
                <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-[0.2em]">
                  Node.Reputation
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-bold font-headline tracking-tighter text-secondary neon-glow-primary">
                  {reputation}
                </span>
                <span className="text-on-surface-variant font-mono text-xs uppercase opacity-60">Pts</span>
              </div>
              <div className="mt-4 sm:mt-6">
                <p className="text-[10px] font-mono text-on-surface-variant leading-relaxed">
                  <span className="text-secondary/80">RANK_PCT:</span>{" "}
                  {reputation >= 100 ? "0.01 (LEGEND)" : reputation >= 50 ? "0.03 (EXPERT)" : reputation >= 20 ? "0.05 (TOP_TIER)" : "NEW_NODE"}
                </p>
              </div>
            </div>

            {/* Metric 3: Network Nodes */}
            <div className="flex-1 p-5 sm:p-8 group hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center gap-2 mb-4">
                <Network className="text-tertiary text-lg" />
                <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-[0.2em]">
                  Network.Nodes
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-bold font-headline tracking-tighter text-on-surface">
                  {networkNodes}
                </span>
                <span className="text-on-surface-variant font-mono text-[10px] uppercase opacity-60">Active</span>
              </div>
              <div className="mt-4 sm:mt-6 flex items-center -space-x-1.5">
                <div className="w-5 h-5 rounded-full border border-surface bg-surface-container-highest" />
                <div className="w-5 h-5 rounded-full border border-surface bg-primary/40" />
                <div className="w-5 h-5 rounded-full border border-surface bg-secondary/40" />
                <div className="w-5 h-5 rounded-full border border-surface bg-tertiary/20 flex items-center justify-center text-[8px] font-mono text-tertiary">
                  +{networkNodes - 3}
                </div>
                <span className="ml-4 text-[10px] font-mono text-outline-variant">CLUSTER_SYNC</span>
              </div>
            </div>

            {/* Metric 4: IPFS Records */}
            <div className="flex-1 p-5 sm:p-8 group hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center gap-2 mb-4">
                <Database className="text-on-surface-variant text-lg" />
                <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-[0.2em]">
                  Ledger.Sync
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-bold font-headline tracking-tighter text-on-surface">
                  {totalContributions.toLocaleString()}
                </span>
                <span className="text-on-surface-variant font-mono text-[10px] uppercase opacity-60">Records</span>
              </div>
              <div className="mt-4 sm:mt-6 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                <span className="text-[10px] font-mono text-secondary uppercase tracking-wider">VERIFIED_ON_CHAIN</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── MAIN GRID ─────────────────────────────────────── */}
        <div className="grid grid-cols-12 gap-6 sm:gap-8 items-start">

          {/* ── SUBMIT PANEL (Left Sidebar) ─────────────────── */}
          <aside className="col-span-12 lg:col-span-4 lg:sticky lg:top-24">
            <div className="glass-panel rounded-xl p-6 sm:p-8 border-l-4 border-l-primary-container">
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <h2 className="text-lg sm:text-xl font-bold font-headline">Submit Contribution</h2>
                <ChevronDown className="text-on-surface-variant" />
              </div>

              <div className="space-y-5 sm:space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-on-surface-variant uppercase tracking-wider">
                    Contribution Title
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-surface-container-lowest border-none rounded-lg focus:ring-1 focus:ring-primary/40 text-sm py-3 px-4 transition-all outline-none text-on-surface placeholder:text-on-surface-variant/50"
                    placeholder="Implement zero-knowledge proof for rewards..."
                    type="text"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-on-surface-variant uppercase tracking-wider">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-surface-container-lowest border-none rounded-lg focus:ring-1 focus:ring-primary/40 text-sm py-3 px-4 transition-all outline-none text-on-surface placeholder:text-on-surface-variant/50 resize-none"
                    placeholder="Explain the impact and technical scope of your work..."
                    rows={3}
                  />
                </div>

                {/* GitHub URL */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-on-surface-variant uppercase tracking-wider">
                    GitHub URL / IPFS CID
                  </label>
                  <div className="relative">
                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm" />
                    <input
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      className="w-full bg-surface-container-lowest border-none rounded-lg focus:ring-1 focus:ring-primary/40 text-sm py-3 pl-10 pr-4 transition-all outline-none text-on-surface placeholder:text-on-surface-variant/50"
                      placeholder="https://github.com/... or QmXp..."
                      type="text"
                    />
                  </div>
                </div>

                {/* AI Analysis Preview */}
                <div className="pt-4 border-t border-outline-variant/10">
                  <p className="text-[10px] font-mono text-on-surface-variant mb-4 uppercase tracking-tighter">
                    AI Analysis Preview
                  </p>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-[10px] font-mono mb-1">
                        <span className="text-on-surface-variant">Impact</span>
                        <span className="text-primary">85%</span>
                      </div>
                      <div className="h-1 bg-surface-container-highest rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-[85%]" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] font-mono mb-1">
                        <span className="text-on-surface-variant">Quality</span>
                        <span className="text-secondary">92%</span>
                      </div>
                      <div className="h-1 bg-surface-container-highest rounded-full overflow-hidden">
                        <div className="h-full bg-secondary w-[92%]" />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <div className="text-[10px] font-mono mb-1 text-on-surface-variant">Security</div>
                        <div className="h-1 bg-surface-container-highest rounded-full overflow-hidden">
                          <div className="h-full bg-tertiary w-[70%]" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-[10px] font-mono mb-1 text-on-surface-variant">Complexity</div>
                        <div className="h-1 bg-surface-container-highest rounded-full overflow-hidden">
                          <div className="h-full bg-on-surface-variant w-[45%]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                {!account ? (
                  <button
                    onClick={connectWallet}
                    disabled={connecting}
                    className="w-full bg-surface-container-high border border-outline-variant/20 text-on-surface-variant font-bold py-4 rounded-lg flex items-center justify-center gap-2 mt-4 transition-all text-sm"
                  >
                    <Wallet className="w-5 h-5" />
                    Connect Wallet to Submit
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || !title.trim() || !githubUrl.trim()}
                    className="w-full bg-gradient-to-r from-primary-container to-primary-container/80 text-on-primary font-bold py-4 rounded-lg flex items-center justify-center gap-2 mt-4 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary-container/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? <Hourglass className="w-5 h-5" /> : <Link2 className="w-5 h-5" />}
                    {submitting ? "Recording On-Chain…" : "Record On-Chain"}
                  </button>
                )}
              </div>
            </div>

            {/* ── GITHUB CONTRIBUTIONS PANEL ─────────────────── */}
            <div className="glass-panel rounded-xl p-6 sm:p-8 mt-6 border-l-4 border-l-secondary/40">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Github className="text-on-surface text-lg" />
                  <h2 className="text-lg font-bold font-headline">GitHub Activity</h2>
                </div>
                {githubUser && (
                  <span className="text-[10px] font-mono text-secondary px-2 py-0.5 bg-secondary/10 rounded-sm">
                    CONNECTED
                  </span>
                )}
              </div>

              {!githubUser ? (
                <div className="text-center py-6">
                  <p className="text-xs text-on-surface-variant mb-4">
                    Connect your GitHub account to see your recent contributions here.
                  </p>
                  <button
                    onClick={loginWithGitHub}
                    className="w-full flex items-center justify-center gap-2 bg-white text-[#131315] font-bold py-2.5 rounded-lg hover:bg-zinc-100 transition-all text-sm"
                  >
                    <Github className="w-4 h-4" />
                    Connect GitHub
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-surface-container-lowest/50 rounded-lg mb-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={githubUser.avatar_url}
                      alt={githubUser.login}
                      className="w-10 h-10 rounded-full border border-outline-variant/20"
                    />
                    <div>
                      <p className="text-sm font-bold text-on-surface">{githubUser.name || githubUser.login}</p>
                      <p className="text-[10px] font-mono text-on-surface-variant">@{githubUser.login}</p>
                    </div>
                  </div>

                  <p className="text-[10px] font-mono text-on-surface-variant uppercase tracking-widest mb-2">
                    Recent Repositories
                  </p>
                  
                  {githubUser.contributions && githubUser.contributions.length > 0 ? (
                    githubUser.contributions.map((repo) => (
                      <a
                        key={repo.id}
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3 rounded-lg bg-surface-container-lowest/30 hover:bg-surface-container-lowest/60 transition-all group border border-transparent hover:border-outline-variant/10"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-bold text-primary group-hover:underline truncate pr-2">
                            {repo.name}
                          </p>
                          <div className="flex items-center gap-1 text-[10px] text-on-surface-variant">
                            <Star className="w-3 h-3" />
                            {repo.stargazers_count}
                          </div>
                        </div>
                        {repo.description && (
                          <p className="text-[10px] text-on-surface-variant line-clamp-1 mb-2">
                            {repo.description}
                          </p>
                        )}
                        <div className="flex items-center gap-3">
                          {repo.language && (
                            <div className="flex items-center gap-1">
                              <Code2 className="w-3 h-3 text-secondary" />
                              <span className="text-[10px] text-on-surface-variant">{repo.language}</span>
                            </div>
                          )}
                          <span className="text-[10px] text-outline-variant">
                            Updated {new Date(repo.updated_at).toLocaleDateString()}
                          </span>
                        </div>
                      </a>
                    ))
                  ) : (
                    <p className="text-xs text-on-surface-variant text-center py-4 italic">
                      No public repositories found.
                    </p>
                  )}
                  
                  <a
                    href={githubUser.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center text-[10px] font-mono text-secondary hover:underline mt-2"
                  >
                    VIEW FULL PROFILE →
                  </a>
                </div>
              )}
            </div>
          </aside>

          {/* ── CONTRIBUTION FEED (Main) ─────────────────────── */}
          <div className="col-span-12 lg:col-span-8 space-y-6 sm:space-y-8">

            {/* Feed Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                <h2 className="text-xl sm:text-2xl font-bold font-headline tracking-tight">
                  Recent Contributions
                </h2>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-surface-container-low rounded-lg border border-outline-variant/10 text-xs text-on-surface-variant cursor-pointer"
                onClick={() => setSortNewest(!sortNewest)}
              >
                <span>Sort:</span>
                <span className="text-on-surface font-medium">{sortNewest ? "Newest" : "Oldest"}</span>
                <ChevronDown className="text-sm" />
              </div>
            </div>

            {/* Empty State */}
            {contributions.length === 0 ? (
              <div className="flex flex-col items-center justify-center glass-panel rounded-2xl py-20 text-on-surface-variant gap-4">
                <Terminal className="text-5xl text-primary" />
                <p className="font-headline font-bold text-lg text-on-surface">No contributions yet</p>
                <p className="text-sm text-center max-w-xs">
                  Submit your first on-chain contribution using the panel on the left.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* First contribution: expanded card (design's featured card) */}
                {sortedContributions.slice(0, 1).map((c, i) => (
                  <div key={c.id} className="glass-panel rounded-xl overflow-hidden border border-primary/20">
                    <div className="p-5 sm:p-6">
                      <div className="flex items-start justify-between mb-5 sm:mb-6 gap-3">
                        <div className="flex gap-3 sm:gap-4 min-w-0">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-primary-container to-secondary overflow-hidden flex items-center justify-center flex-shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              alt="Identicon"
                              className="w-8 h-8 sm:w-10 sm:h-10"
                              src={IDENTICONS[i % IDENTICONS.length]}
                            />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-base sm:text-lg font-bold font-headline leading-tight truncate">
                              {c.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <span className="text-xs font-mono text-primary">{shortAddr(c.contributor)}</span>
                              <span className="text-on-surface-variant text-[10px]">•</span>
                              <span className="text-xs text-on-surface-variant">{relativeTime(c.timestamp)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <span className="px-3 py-1 bg-secondary/10 text-secondary border border-secondary/20 rounded-full text-xs font-bold shadow-[0_0_8px_rgba(78,222,163,0.2)] whitespace-nowrap">
                            +10 REP
                          </span>
                          <span className="flex items-center gap-1 text-[10px] font-mono text-secondary">
                            <Shield className="text-[10px]" />
                            On-Chain
                          </span>
                        </div>
                      </div>

                      {/* Metadata grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8 pt-5 sm:pt-6 border-t border-outline-variant/10">
                        <div>
                          <p className="text-xs text-on-surface-variant mb-4">AI Performance Metrics</p>
                          <div className="space-y-3 sm:space-y-4">
                            {[
                              { label: "Architecture Impact", value: 94, color: "bg-primary", shadow: "shadow-[0_0_8px_rgba(210,187,255,0.4)]", text: "9.4/10" },
                              { label: "Code Cleanliness", value: 88, color: "bg-secondary", shadow: "shadow-[0_0_8px_rgba(78,222,163,0.4)]", text: "8.8/10" },
                              { label: "Risk Assessment", value: 95, color: "bg-tertiary", shadow: "shadow-[0_0_8px_rgba(173,198,255,0.4)]", text: "Minimal" },
                            ].map((bar) => (
                              <div key={bar.label}>
                                <div className="flex justify-between text-xs font-mono mb-1">
                                  <span className="text-on-surface-variant">{bar.label}</span>
                                  <span className="text-on-surface">{bar.text}</span>
                                </div>
                                <div className="h-1.5 bg-surface-container-highest rounded-full">
                                  <div className={`h-full ${bar.color} ${bar.shadow} rounded-full`} style={{ width: `${bar.value}%` }} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="bg-surface-container-lowest/50 rounded-lg p-4 flex flex-col justify-between">
                          <div>
                            <p className="text-[10px] font-mono text-on-surface-variant uppercase tracking-widest mb-2">
                              On-Chain Metadata
                            </p>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs text-on-surface-variant">IPFS CID</span>
                                <a
                                  href={`https://gateway.pinata.cloud/ipfs/${c.ipfsCID}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs font-mono text-secondary cursor-pointer hover:underline truncate max-w-[120px]"
                                >
                                  {c.ipfsCID.slice(0, 12)}...
                                </a>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-on-surface-variant">Contributor</span>
                                <span className="text-xs font-mono text-primary">{shortAddr(c.contributor)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-3 mt-5 sm:mt-6">
                            <a
                              href={`https://amoy.polygonscan.com/address/${c.contributor}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 py-2 bg-surface-container-highest rounded-lg text-xs font-medium flex items-center justify-center gap-2 hover:bg-surface-bright transition-all"
                            >
                              <ExternalLink className="text-sm" />
                              PolygonScan
                            </a>
                            <a
                              href={`https://gateway.pinata.cloud/ipfs/${c.ipfsCID}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 py-2 bg-surface-container-highest rounded-lg text-xs font-medium flex items-center justify-center gap-2 hover:bg-surface-bright transition-all"
                            >
                              <Database className="text-sm" />
                              View Source
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Remaining contributions: compact cards */}
                {displayedContributions.slice(1).map((c, i) => (
                  <div
                    key={c.id}
                    className="glass-panel rounded-xl p-4 sm:p-6 hover:bg-surface-container-low transition-all cursor-pointer group border border-transparent hover:border-outline-variant/20"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-surface-container-highest flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            alt="Identicon"
                            className="w-7 h-7 sm:w-8 sm:h-8"
                            src={IDENTICONS[(i + 1) % IDENTICONS.length]}
                          />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm sm:text-base font-bold font-headline truncate">
                            {c.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <span className="text-[10px] font-mono text-primary">{shortAddr(c.contributor)}</span>
                            <span className="text-on-surface-variant text-[10px]">•</span>
                            <span className="text-[10px] text-on-surface-variant">{relativeTime(c.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
                        <span className="px-2 py-1 bg-surface-container-highest text-on-surface-variant rounded-lg text-[10px] font-mono whitespace-nowrap">
                          +10 REP
                        </span>
                        <div className="hidden sm:flex gap-2">
                          <Database className="text-on-surface-variant group-hover:text-primary transition-colors text-lg" />
                          <Compass className="text-on-surface-variant group-hover:text-secondary transition-colors text-lg" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* View more / less */}
            {contributions.length > 4 && (
              <div className="flex justify-center pt-4 sm:pt-8">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="px-6 sm:px-8 py-2.5 sm:py-3 bg-surface-container-low border border-outline-variant/10 rounded-full text-sm font-medium hover:bg-surface-container-highest transition-all flex items-center gap-2"
                >
                  {showAll ? "Show Less" : "View Historical Log"}
                  {showAll ? <ChevronUp className="text-sm" /> : <History className="text-sm" />}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
