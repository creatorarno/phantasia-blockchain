"use client";

import { useState } from "react";
import { useContract } from "@/hooks/useContract";
import { pinJSON, ipfsUrl } from "@/lib/pinata";
import type { ContributionPayload } from "@/lib/pinata";

// ─── Small helper: shorten 0x address ────────────────────────────
function shortAddr(addr: string) {
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

// ─── Reputation badge level ──────────────────────────────────────
function repLevel(rep: number) {
  if (rep >= 100) return { label: "Legend", color: "from-yellow-400 to-amber-500", icon: "🏆" };
  if (rep >= 50) return { label: "Expert", color: "from-purple-500 to-pink-500", icon: "⚡" };
  if (rep >= 20) return { label: "Builder", color: "from-cyan-400 to-blue-500", icon: "🔧" };
  return { label: "Newcomer", color: "from-gray-400 to-gray-500", icon: "🌱" };
}

// ═══════════════════════════════════════════════════════════════
//  MAIN PAGE
// ═══════════════════════════════════════════════════════════════
export default function Dashboard() {
  const {
    account,
    connecting,
    connectWallet,
    reputation,
    contributions,
    submitContribution,
    submitting,
    txHash,
    error,
  } = useContract();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [github, setGithub] = useState("");
  const [pinning, setPinning] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const level = repLevel(reputation);

  // ─── Handle form submit ────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLocalError(null);

    if (!account) {
      setLocalError("Connect your wallet first.");
      return;
    }
    if (!title.trim() || !description.trim()) {
      setLocalError("Title and Description are required.");
      return;
    }

    try {
      // 1. Pin JSON to IPFS
      setPinning(true);
      const payload: ContributionPayload = {
        title: title.trim(),
        description: description.trim(),
        github: github.trim(),
        contributor: account,
        timestamp: Date.now(),
      };
      const cid = await pinJSON(payload);
      setPinning(false);

      // 2. Submit TX
      await submitContribution(cid);

      // 3. Reset form
      setTitle("");
      setDescription("");
      setGithub("");
    } catch (err: unknown) {
      setPinning(false);
      setLocalError((err as Error).message);
    }
  }

  const displayError = localError || error;
  const busy = pinning || submitting;

  // ═══════════════════════════════════════════════════════════════
  //  RENDER
  // ═══════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans">
      {/* ─── Header ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600" />
            <h1 className="text-xl font-bold tracking-tight">
              Phantasia<span className="text-cyan-400">.</span>
            </h1>
          </div>

          {account ? (
            <div className="flex items-center gap-4">
              {/* reputation pill */}
              <div className={`flex items-center gap-2 rounded-full bg-gradient-to-r ${level.color} px-4 py-1.5 text-sm font-bold text-black shadow-lg`}>
                <span>{level.icon}</span>
                <span>{reputation} REP</span>
                <span className="opacity-70">·</span>
                <span>{level.label}</span>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-sm">
                {shortAddr(account)}
              </div>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              disabled={connecting}
              className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2 font-semibold transition hover:brightness-110 disabled:opacity-50"
            >
              {connecting ? "Connecting…" : "Connect Wallet"}
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* ─── Hero / Rep Card ───────────────────────────────────── */}
        {account && (
          <section className="mb-12 overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-[#0f1628] to-[#0a0a0f] p-8">
            <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
              <div>
                <p className="mb-1 text-sm uppercase tracking-widest text-cyan-400">Your Impact Score</p>
                <div className="flex items-end gap-3">
                  <span className="text-7xl font-black tabular-nums leading-none">{reputation}</span>
                  <span className="mb-2 text-lg text-white/40">points</span>
                </div>
                <p className="mt-2 text-white/50">
                  Each contribution earns <span className="text-cyan-300 font-semibold">+10 REP</span>. Level up by shipping more.
                </p>
              </div>
              {/* level badge */}
              <div className="flex flex-col items-center gap-2">
                <div className={`flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br ${level.color} text-5xl shadow-2xl`}>
                  {level.icon}
                </div>
                <span className={`rounded-full bg-gradient-to-r ${level.color} px-4 py-1 text-sm font-bold text-black`}>
                  {level.label}
                </span>
              </div>
            </div>
            {/* progress bar to next level */}
            <div className="mt-6">
              <div className="mb-1 flex justify-between text-xs text-white/40">
                <span>Progress to next level</span>
                <span>{reputation % 50} / 50</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-700"
                  style={{ width: `${((reputation % 50) / 50) * 100}%` }}
                />
              </div>
            </div>
          </section>
        )}

        <div className="grid gap-10 lg:grid-cols-5">
          {/* ─── Submit Form ─────────────────────────────────────── */}
          <section className="lg:col-span-2">
            <div className="rounded-2xl border border-white/5 bg-[#111118] p-6">
              <h2 className="mb-6 text-lg font-bold">
                <span className="mr-2 inline-block h-3 w-3 rounded-full bg-cyan-400" />
                New Contribution
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm text-white/60">Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Built a DEX aggregator"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none placeholder:text-white/20 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm text-white/60">Description *</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="What did you build and why does it matter?"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none placeholder:text-white/20 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 resize-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm text-white/60">GitHub URL</label>
                  <input
                    type="url"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="https://github.com/you/repo"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none placeholder:text-white/20 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30"
                  />
                </div>

                {displayError && (
                  <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
                    {displayError}
                  </div>
                )}

                {txHash && (
                  <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm text-green-400">
                    ✓ TX confirmed!{" "}
                    <a
                      href={`https://amoy.polygonscan.com/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      View on Explorer →
                    </a>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={busy || !account}
                  className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 py-3 font-bold transition hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {!account
                    ? "Connect Wallet to Submit"
                    : pinning
                    ? "📌 Pinning to IPFS…"
                    : submitting
                    ? "⛓️ Confirming on-chain…"
                    : "Submit Contribution"}
                </button>
              </form>

              {/* flow steps */}
              <div className="mt-6 space-y-2">
                {[
                  { step: 1, text: "Fill in your contribution details" },
                  { step: 2, text: "JSON pinned to IPFS via Pinata" },
                  { step: 3, text: "IPFS hash stored on Polygon Amoy" },
                  { step: 4, text: "Reputation +10 — instant update" },
                ].map(({ step, text }) => (
                  <div key={step} className="flex items-center gap-3 text-xs text-white/30">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/5 text-[10px] font-bold text-cyan-400">
                      {step}
                    </span>
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ─── Contributions Feed ──────────────────────────────── */}
          <section className="lg:col-span-3">
            <h2 className="mb-6 text-lg font-bold">
              <span className="mr-2 inline-block h-3 w-3 rounded-full bg-purple-400" />
              Public Contribution Feed
              <span className="ml-2 text-sm font-normal text-white/30">
                ({contributions.length})
              </span>
            </h2>

            {contributions.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-20 text-white/20">
                <span className="text-4xl mb-3">📭</span>
                <p>No contributions yet. Be the first!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {contributions.map((c) => (
                  <div
                    key={c.id}
                    className="group rounded-xl border border-white/5 bg-[#111118] p-5 transition hover:border-cyan-500/20 hover:bg-[#13131f]"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-xs font-bold">
                          {c.contributor.slice(2, 4).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-mono text-sm text-white/70">
                            {shortAddr(c.contributor)}
                          </p>
                          <p className="text-xs text-white/30">
                            {new Date(c.timestamp * 1000).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                      <span className="rounded-full bg-cyan-500/10 px-3 py-0.5 text-xs font-semibold text-cyan-400">
                        #{c.id}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-xs font-mono text-white/50">
                      <span className="text-cyan-400">IPFS</span>
                      <a
                        href={ipfsUrl(c.ipfsHash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate underline decoration-white/20 hover:text-white transition"
                      >
                        {c.ipfsHash}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* ─── Footer ──────────────────────────────────────────────── */}
      <footer className="mt-20 border-t border-white/5 py-8 text-center text-xs text-white/20">
        Phantasia · Decentralized Contribution & Reputation Protocol · Built for Hackathon 2026
      </footer>
    </div>
  );
}
