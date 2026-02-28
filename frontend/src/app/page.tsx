"use client";

import { useState } from "react";
import { useContract } from "@/hooks/useContract";
import { ContributionCard } from "@/components/ContributionCard";

// ─── Pinata helper (inline to keep it simple) ───────────────────
const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT ?? "";

async function pinJSON(payload: Record<string, unknown>): Promise<string> {
  const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${PINATA_JWT}`,
    },
    body: JSON.stringify({
      pinataContent: payload,
      pinataMetadata: { name: `cc-web-${Date.now()}` },
    }),
  });
  if (!res.ok) throw new Error(`Pinata: ${await res.text()}`);
  return (await res.json()).IpfsHash as string;
}

// ─── Gemini analysis (inline) ────────────────────────────────────
const GEMINI_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? "";

interface AIResult {
  summary: string;
  impactScore: number;
  riskLevel: string;
  contributionType: string;
  suggestions: string[];
}

async function analyzeTitle(title: string, desc: string): Promise<AIResult> {
  if (!GEMINI_KEY) {
    return {
      summary: desc || title,
      impactScore: 5,
      riskLevel: "medium",
      contributionType: "feature",
      suggestions: [],
    };
  }
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a code contribution reviewer. Given this contribution title and description, return ONLY valid JSON:\n{"summary":"...","impactScore":<0-10>,"riskLevel":"<low|medium|high|critical>","contributionType":"<bugfix|feature|refactor|docs|test|chore|security|performance>","suggestions":["..."]}\n\nTitle: ${title}\nDescription: ${desc}`,
                },
              ],
            },
          ],
          generationConfig: { temperature: 0.2, maxOutputTokens: 512 },
        }),
      }
    );
    if (!res.ok) throw new Error("API fail");
    const json = await res.json();
    const text: string = json?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    return JSON.parse(text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim());
  } catch {
    return { summary: desc || title, impactScore: 5, riskLevel: "medium", contributionType: "feature", suggestions: [] };
  }
}

// ─── Helpers ─────────────────────────────────────────────────────
function shortAddr(a: string) {
  return a.slice(0, 6) + "..." + a.slice(-4);
}

function repLevel(rep: number) {
  if (rep >= 100) return { label: "Legend", color: "from-yellow-400 to-amber-500", icon: "🏆" };
  if (rep >= 50) return { label: "Expert", color: "from-purple-500 to-pink-500", icon: "⚡" };
  if (rep >= 20) return { label: "Builder", color: "from-cyan-400 to-blue-500", icon: "🔧" };
  return { label: "Newcomer", color: "from-gray-400 to-gray-500", icon: "🌱" };
}

// ═══════════════════════════════════════════════════════════════
//  DASHBOARD
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLocalError(null);

    if (!account) { setLocalError("Connect your wallet first."); return; }
    if (!title.trim()) { setLocalError("Title is required."); return; }

    try {
      // 1. AI analysis
      setPinning(true);
      const analysis = await analyzeTitle(title, description);

      // 2. Pin to IPFS
      const payload = {
        title: title.trim(),
        diff: description.trim() || "Submitted via web UI",
        analysis,
        contributor: account,
        github: github.trim(),
        timestamp: Date.now(),
      };
      const cid = await pinJSON(payload);
      setPinning(false);

      // 3. On-chain TX
      await submitContribution(title.trim(), cid);

      // 4. Reset
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

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans">
      {/* ─── NAV ──────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="relative h-8 w-8">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 blur-sm opacity-60" />
              <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-xs font-black">
                CC
              </div>
            </div>
            <h1 className="text-xl font-bold tracking-tight">
              Commit<span className="text-cyan-400">Chain</span>
            </h1>
            <span className="ml-2 rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-400 uppercase tracking-wider">
              Amoy Testnet
            </span>
          </div>

          {account ? (
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 rounded-full bg-gradient-to-r ${level.color} px-4 py-1.5 text-sm font-bold text-black shadow-lg`}>
                <span>{level.icon}</span>
                <span>{reputation} REP</span>
                <span className="opacity-60">·</span>
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
              className="group relative rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2 font-semibold transition hover:brightness-110 disabled:opacity-50"
            >
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 blur opacity-40 group-hover:opacity-60 transition" />
              <span className="relative">{connecting ? "Connecting…" : "Connect Wallet"}</span>
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* ─── HERO REPUTATION ────────────────────────────────────── */}
        {account && (
          <section className="mb-12 overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-[#0f1628] via-[#0d1020] to-[#0a0a0f] p-8 relative">
            {/* Glow */}
            <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-cyan-500/10 blur-3xl" />
            <div className="relative flex flex-col items-center gap-6 md:flex-row md:justify-between">
              <div>
                <p className="mb-1 text-sm uppercase tracking-widest text-cyan-400">Your Impact Score</p>
                <div className="flex items-end gap-3">
                  <span className="text-7xl font-black tabular-nums leading-none">{reputation}</span>
                  <span className="mb-2 text-lg text-white/30">points</span>
                </div>
                <p className="mt-2 text-white/40">
                  Each contribution earns <span className="text-cyan-300 font-semibold">+10 REP</span>. Level up by shipping.
                </p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className={`flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br ${level.color} text-5xl shadow-2xl ring-4 ring-black/30`}>
                  {level.icon}
                </div>
                <span className={`rounded-full bg-gradient-to-r ${level.color} px-4 py-1 text-sm font-bold text-black`}>
                  {level.label}
                </span>
              </div>
            </div>
            {/* Progress */}
            <div className="relative mt-6">
              <div className="mb-1 flex justify-between text-xs text-white/30">
                <span>Next level</span>
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
          {/* ─── SUBMIT FORM ──────────────────────────────────────── */}
          <section className="lg:col-span-2">
            <div className="rounded-2xl border border-white/5 bg-[#111118]/80 backdrop-blur-sm p-6">
              <h2 className="mb-6 text-lg font-bold flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/30" />
                New Contribution
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm text-white/50">Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Fix auth race condition"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none placeholder:text-white/20 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm text-white/50">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="What did you build and why does it matter?"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none placeholder:text-white/20 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 resize-none transition"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm text-white/50">GitHub URL</label>
                  <input
                    type="url"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="https://github.com/you/repo"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none placeholder:text-white/20 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition"
                  />
                </div>

                {displayError && (
                  <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
                    {displayError}
                  </div>
                )}

                {txHash && (
                  <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-2.5 text-sm text-green-400">
                    ✓ Confirmed!{" "}
                    <a
                      href={`https://amoy.polygonscan.com/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      View TX →
                    </a>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={busy || !account}
                  className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 py-3 font-bold transition hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed relative group"
                >
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 blur opacity-0 group-hover:opacity-30 transition" />
                  <span className="relative">
                    {!account
                      ? "Connect Wallet to Submit"
                      : pinning
                      ? "🧠 AI Analysis + IPFS Pin…"
                      : submitting
                      ? "⛓️ Confirming on-chain…"
                      : "Submit Contribution"}
                  </span>
                </button>
              </form>

              {/* Flow steps */}
              <div className="mt-6 space-y-2">
                {[
                  { s: 1, t: "Fill in contribution details", i: "📝" },
                  { s: 2, t: "AI analyzes & scores impact", i: "🧠" },
                  { s: 3, t: "JSON pinned to IPFS (Pinata)", i: "📌" },
                  { s: 4, t: "CID stored on Polygon Amoy", i: "⛓️" },
                  { s: 5, t: "Reputation +10 — level up!", i: "🏆" },
                ].map(({ s, t, i }) => (
                  <div key={s} className="flex items-center gap-3 text-xs text-white/25">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/5 text-[10px]">
                      {i}
                    </span>
                    {t}
                  </div>
                ))}
              </div>
            </div>

            {/* CLI promo */}
            <div className="mt-4 rounded-xl border border-white/5 bg-[#111118]/50 p-4">
              <p className="text-xs text-white/40 mb-2">⚡ Pro: Use the CLI for git-diff analysis</p>
              <code className="block rounded-lg bg-black/50 px-3 py-2 text-xs text-cyan-400 font-mono">
                commitchain submit --title &quot;Fix auth bug&quot;
              </code>
            </div>
          </section>

          {/* ─── FEED ─────────────────────────────────────────────── */}
          <section className="lg:col-span-3">
            <h2 className="mb-6 text-lg font-bold flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-purple-400 shadow-lg shadow-purple-400/30" />
              Contribution Feed
              <span className="ml-1 text-sm font-normal text-white/25">
                ({contributions.length})
              </span>
            </h2>

            {contributions.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-20 text-white/20">
                <span className="text-5xl mb-4">📭</span>
                <p className="font-medium">No contributions yet</p>
                <p className="text-sm mt-1">Be the first to ship something!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {contributions.map((c) => (
                  <ContributionCard key={c.id} c={c} />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* ─── HOW IT WORKS ───────────────────────────────────────── */}
        <section className="mt-20">
          <h2 className="mb-8 text-center text-2xl font-bold">How CommitChain Works</h2>
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { icon: "🔧", title: "Code", desc: "Write code & stage changes in git" },
              { icon: "🧠", title: "Analyze", desc: "AI reviews diff for impact & risk" },
              { icon: "📌", title: "Pin", desc: "Proof stored permanently on IPFS" },
              { icon: "⛓️", title: "Record", desc: "Authorship + rep stored on-chain" },
            ].map(({ icon, title: t, desc }) => (
              <div
                key={t}
                className="rounded-xl border border-white/5 bg-[#111118]/50 p-5 text-center hover:border-cyan-500/20 transition"
              >
                <div className="text-3xl mb-3">{icon}</div>
                <p className="font-bold text-sm mb-1">{t}</p>
                <p className="text-xs text-white/40">{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ─── FOOTER ───────────────────────────────────────────────── */}
      <footer className="mt-20 border-t border-white/5 py-8 text-center text-xs text-white/15">
        CommitChain · Decentralized AI-Powered Open Source Contribution Protocol · Hackathon 2026
      </footer>
    </div>
  );
}
