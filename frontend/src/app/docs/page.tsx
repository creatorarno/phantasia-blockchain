"use client";

import Link from "next/link";
import {
  Code2,
  ArrowLeft,
  Terminal,
  Zap,
  Shield,
  Package,
  GitBranch,
  Lock,
  FileCode,
  Server,
  Wallet,
  Brain,
  Pin,
  Link2,
  Trophy,
  Bug,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import { InteractiveBackground } from "@/components/InteractiveBackground";
import { RotatingMadeBy } from "@/components/RotatingMadeBy";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <InteractiveBackground />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/20 bg-background/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">CommitChain</span>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl sm:text-6xl font-bold mb-4">
            <span className="text-gradient-primary">CommitChain CLI</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            <code className="text-primary font-mono">@commitchain/cli</code> — AI-Powered Decentralized Contribution Tool
          </p>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            Submit verifiable code contributions on-chain with AI analysis and IPFS proof.
          </p>
        </div>

        {/* Overview */}
        <section className="mb-16">
          <div className="rounded-2xl border border-border/30 bg-secondary/20 p-8 hover:border-primary/40 transition-all">
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
              <Zap className="w-8 h-8 text-primary" />
              Overview
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong className="text-foreground">CommitChain CLI</strong> is a developer tool that allows you to submit code contributions directly from your local Git repository to the CommitChain protocol.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              It extracts your git diff, analyzes code using AI (Gemini), uploads contribution data to IPFS (Pinata), and records proof + reputation on Polygon blockchain. This creates a <strong className="text-foreground">tamper-proof, AI-verified contribution history</strong> tied to your wallet.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-border/30 bg-secondary/30 p-4">
                <Brain className="w-6 h-6 text-primary mb-2" />
                <h3 className="font-bold mb-1 text-sm">AI Analysis</h3>
                <p className="text-xs text-muted-foreground">Gemini evaluates code quality, security, and impact</p>
              </div>
              <div className="rounded-xl border border-border/30 bg-secondary/30 p-4">
                <Pin className="w-6 h-6 text-primary mb-2" />
                <h3 className="font-bold mb-1 text-sm">IPFS Storage</h3>
                <p className="text-xs text-muted-foreground">Immutable proof stored permanently via Pinata</p>
              </div>
              <div className="rounded-xl border border-border/30 bg-secondary/30 p-4">
                <Link2 className="w-6 h-6 text-primary mb-2" />
                <h3 className="font-bold mb-1 text-sm">On-Chain Record</h3>
                <p className="text-xs text-muted-foreground">Proof + reputation on Polygon blockchain</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works (High-Level Flow) */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <GitBranch className="w-8 h-8 text-primary" />
            How It Works (High-Level Flow)
          </h2>
          <div className="rounded-xl border border-border/30 bg-secondary/20 p-6 font-mono text-sm text-muted-foreground">
            <pre className="whitespace-pre overflow-x-auto">{`Local Git Repo
      ↓
CommitChain CLI (commitchain submit)
      ↓
AI Analysis (Gemini)
      ↓
IPFS Storage (Pinata CID)
      ↓
Blockchain Recording (Polygon Amoy)
      ↓
CommitChain Dashboard (Profile + Leaderboard)`}</pre>
          </div>
        </section>

        {/* Installation */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Package className="w-8 h-8 text-primary" />
            Installation
          </h2>
          <p className="text-muted-foreground mb-4">
            Install the CLI globally via npm:
          </p>
          <div className="rounded-xl border border-border/30 bg-secondary/20 p-6 space-y-4">
            <div className="rounded-lg bg-secondary/50 p-4 font-mono text-sm">
              <span className="text-muted-foreground">$</span> <span className="text-primary">npm install -g @commitchain/cli</span>
            </div>
            <p className="text-sm text-muted-foreground">Verify installation:</p>
            <div className="rounded-lg bg-secondary/50 p-4 font-mono text-sm">
              <span className="text-muted-foreground">$</span> <span className="text-primary">commitchain --version</span>
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-primary" />
            Requirements
          </h2>
          <p className="text-muted-foreground mb-4">
            Before using CommitChain CLI, ensure you have:
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> Node.js ≥ 18</li>
            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> Git installed and initialized in your project</li>
            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> A GitHub-connected repository (recommended)</li>
            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> MetaMask wallet private key (for signing transactions)</li>
            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> Internet connection (AI + IPFS + Blockchain)</li>
          </ul>
        </section>

        {/* Basic Usage */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Terminal className="w-8 h-8 text-primary" />
            Basic Usage
          </h2>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Submit a Contribution
          </h3>
          <div className="rounded-xl border border-border/30 bg-secondary/20 p-6 space-y-4">
            <div className="rounded-lg bg-secondary/50 p-4 font-mono text-sm">
              <span className="text-primary">commitchain submit</span> <span className="text-accent">--title</span> <span className="text-foreground">&quot;Your change title&quot;</span> <span className="text-accent">--private-key</span> <span className="text-foreground">&quot;YOUR_PRIVATE_KEY&quot;</span>
            </div>
            <p className="text-sm font-semibold text-foreground">Example:</p>
            <div className="rounded-lg bg-secondary/50 p-4 font-mono text-sm">
              <span className="text-primary">commitchain submit</span> <span className="text-accent">--title</span> <span className="text-foreground">&quot;Refactored authentication logic&quot;</span> <span className="text-accent">--private-key</span> <span className="text-foreground">&quot;0xabc123...&quot;</span>
            </div>
            <p className="text-sm text-muted-foreground">
              This command will: extract git diff, analyze changes using AI, upload report to IPFS, record contribution on-chain, and update your on-chain reputation.
            </p>
          </div>
        </section>

        {/* CLI Output Explained */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Terminal className="w-8 h-8 text-primary" />
            CLI Output Explained
          </h2>
          <div className="rounded-xl border border-border/30 bg-secondary/20 p-6">
            <div className="rounded-lg bg-secondary/50 p-4 font-mono text-xs text-muted-foreground whitespace-pre overflow-x-auto">{`╔══════════════════════════════════════════╗
║      CommitChain — Submit Contribution   ║
╚══════════════════════════════════════════╝

▸ Step 1 — Extracting git diff
  Diff lines: 13
  Title: First commit hehe :3
  Branch: main

▸ Step 2 — Wallet
  Wallet: 0x8F1C19679a6cA7C1Aa39299f4832FC441E30CE49

▸ Step 3 — AI Analysis + IPFS
  Summary: Code improvement and minor refactor
  Impact: 5/10
  Risk: low
  IPFS CID: QmXXXX...
  Gateway: https://gateway.pinata.cloud/ipfs/...

▸ Step 4 — Recording on-chain
  TX Hash: 0x...
  Contribution recorded successfully!
  Reputation +10 earned on-chain`}</div>
          </div>
        </section>

        {/* Command Reference */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Terminal className="w-8 h-8 text-primary" />
            Command Reference
          </h2>

          <div className="space-y-6">
            <div className="rounded-xl border border-border/30 bg-secondary/20 p-6">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground text-xs">1</span>
                commitchain submit
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Submit a new contribution to the protocol.
              </p>
              <div className="rounded-lg bg-secondary/50 p-4 font-mono text-sm mb-4">
                <span className="text-primary">commitchain submit</span> <span className="text-accent">--title</span> <span className="text-foreground">&quot;&lt;title&gt;&quot;</span> <span className="text-accent">--private-key</span> <span className="text-foreground">&quot;&lt;wallet_private_key&gt;&quot;</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/30">
                      <th className="text-left py-2 font-semibold">Flag</th>
                      <th className="text-left py-2 font-semibold">Type</th>
                      <th className="text-left py-2 font-semibold">Required</th>
                      <th className="text-left py-2 font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border/20">
                      <td className="py-2 font-mono text-accent">--title</td>
                      <td className="py-2">string</td>
                      <td className="py-2 text-primary">Yes</td>
                      <td className="py-2">Title/description of the contribution</td>
                    </tr>
                    <tr className="border-b border-border/20">
                      <td className="py-2 font-mono text-accent">--private-key</td>
                      <td className="py-2">string</td>
                      <td className="py-2 text-primary">Yes</td>
                      <td className="py-2">User wallet private key for signing tx</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-xl border border-border/30 bg-secondary/20 p-6">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground text-xs">2</span>
                commitchain --help
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Show all available commands and usage instructions.
              </p>
              <div className="rounded-lg bg-secondary/50 p-4 font-mono text-sm">
                <span className="text-muted-foreground">$</span> <span className="text-primary">commitchain --help</span>
              </div>
            </div>
          </div>
        </section>

        {/* AI Analysis System */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Brain className="w-8 h-8 text-primary" />
            AI Analysis System (Gemini Integration)
          </h2>
          <p className="text-muted-foreground mb-6">
            CommitChain uses AI to automatically evaluate contributions.
          </p>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              { icon: Brain, label: "Summary of code changes" },
              { icon: Zap, label: "Impact score (0–10)" },
              { icon: FileCode, label: "Code quality score" },
              { icon: Shield, label: "Security analysis" },
              { icon: GitBranch, label: "Complexity level" },
              { icon: Shield, label: "Risk assessment" },
              { icon: FileCode, label: "Contribution type (feature, bugfix, chore, refactor)" },
              { icon: Lightbulb, label: "Improvement suggestions" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 rounded-lg border border-border/30 bg-secondary/30 px-4 py-2">
                <Icon className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            This AI report is stored permanently on IPFS and linked on-chain.
          </p>
        </section>

        {/* IPFS Storage */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Pin className="w-8 h-8 text-primary" />
            IPFS Storage (Proof Layer)
          </h2>
          <p className="text-muted-foreground mb-4">
            Each submission uploads a JSON payload to IPFS containing:
          </p>
          <div className="rounded-xl border border-border/30 bg-secondary/20 p-6">
            <div className="rounded-lg bg-secondary/50 p-4 font-mono text-xs text-muted-foreground overflow-x-auto">
              <pre>{`{
  "title": "Fix login bug",
  "diff": "...git diff...",
  "aiReport": {
    "summary": "...",
    "impact": 7,
    "quality": 8
  },
  "timestamp": 123456789
}`}</pre>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Returned CID example: <code className="text-primary font-mono">QmRT52SACuDLvMJ5cEXATmfhhiVYQFZiGpY6YDFFS69Hnc</code>
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              This CID acts as permanent proof of contribution.
            </p>
          </div>
        </section>

        {/* Blockchain Integration */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Link2 className="w-8 h-8 text-primary" />
            Blockchain Integration (Polygon Amoy)
          </h2>
          <p className="text-muted-foreground mb-4">
            After IPFS upload, the CLI:
          </p>
          <ul className="space-y-2 text-muted-foreground mb-4">
            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> Calls <code className="text-primary text-xs">submitContribution(title, cid)</code></li>
            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> Records contribution immutably</li>
            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> Updates on-chain reputation (+10 per contribution)</li>
          </ul>
          <p className="text-sm font-semibold text-foreground mb-2">Stored On-Chain:</p>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Wallet address</li>
            <li>• Title</li>
            <li>• IPFS CID</li>
            <li>• Timestamp</li>
            <li>• Reputation score</li>
          </ul>
        </section>

        {/* User Profile & Dashboard */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Wallet className="w-8 h-8 text-primary" />
            User Profile & Dashboard
          </h2>
          <p className="text-muted-foreground mb-4">
            After submitting contributions, users can:
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> Connect wallet on CommitChain website</li>
            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> View personal contribution history</li>
            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> Check AI scores</li>
            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> Track reputation level</li>
            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> View global leaderboard</li>
            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> Explore public decentralized feed</li>
          </ul>
          <Link
            href="/dashboard"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-all"
          >
            Launch Dashboard
          </Link>
        </section>

        {/* Security Notice */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Lock className="w-8 h-8 text-primary" />
            Security Notice (IMPORTANT)
          </h2>
          <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-yellow-400">
              <AlertTriangle className="w-5 h-5" />
              Private Key Usage
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              The <code className="text-accent">--private-key</code> flag is used ONLY to sign blockchain transactions locally. It is never stored by CommitChain servers.
            </p>
            <p className="text-sm font-semibold text-foreground mb-2">Best Practices:</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-yellow-400" /> Use a burner wallet for testing</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-yellow-400" /> Never expose main wallet private key</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-yellow-400" /> Do NOT commit private keys to GitHub</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-4">
              Recommended alternative (future version): <code className="text-primary">commitchain submit --metamask</code> (for secure wallet signing)
            </p>
          </div>
        </section>

        {/* Error Handling */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Bug className="w-8 h-8 text-primary" />
            Error Handling
          </h2>
          <p className="text-sm font-semibold text-foreground mb-4">Common Errors & Fixes</p>
          <div className="space-y-4">
            <div className="rounded-xl border border-border/30 bg-secondary/20 p-5">
              <p className="font-mono text-sm text-destructive mb-2">&quot;No git diff found&quot;</p>
              <p className="text-sm text-muted-foreground mb-2">Fix:</p>
              <div className="rounded-lg bg-secondary/50 p-3 font-mono text-xs">
                <span className="text-primary">git add</span> .<br />
                <span className="text-primary">git commit</span> -m <span className="text-foreground">&quot;Your changes&quot;</span>
              </div>
            </div>
            <div className="rounded-xl border border-border/30 bg-secondary/20 p-5">
              <p className="font-mono text-sm text-destructive mb-2">Invalid private key</p>
              <p className="text-sm text-muted-foreground">Ensure: starts with <code className="text-primary">0x</code>, correct length (64 hex chars)</p>
            </div>
            <div className="rounded-xl border border-border/30 bg-secondary/20 p-5">
              <p className="font-mono text-sm text-destructive mb-2">Network / RPC error</p>
              <p className="text-sm text-muted-foreground">Check: Internet connection, Polygon Amoy RPC availability</p>
            </div>
          </div>
        </section>

        {/* Supported Environment */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-primary" />
            Supported Environment
          </h2>
          <div className="rounded-xl border border-border/30 bg-secondary/20 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left px-4 py-3 font-semibold">Feature</th>
                  <th className="text-left px-4 py-3 font-semibold">Support</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border/20"><td className="px-4 py-3">Git Repositories</td><td className="px-4 py-3 text-primary">Yes</td></tr>
                <tr className="border-b border-border/20"><td className="px-4 py-3">GitHub Projects</td><td className="px-4 py-3 text-primary">Recommended</td></tr>
                <tr className="border-b border-border/20"><td className="px-4 py-3">Local Repos</td><td className="px-4 py-3 text-primary">Supported</td></tr>
                <tr className="border-b border-border/20"><td className="px-4 py-3">Monorepos</td><td className="px-4 py-3 text-yellow-400">Partial</td></tr>
                <tr className="border-b border-border/20"><td className="px-4 py-3">Private Repos</td><td className="px-4 py-3 text-primary">Yes</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Architecture Summary */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Server className="w-8 h-8 text-primary" />
            Architecture Summary (For Developers)
          </h2>
          <div className="rounded-xl border border-border/30 bg-secondary/20 p-6 font-mono text-sm text-muted-foreground">
            <pre className="whitespace-pre">{`CLI (Node.js)
   ├── simple-git → Extract diff
   ├── Gemini API → AI analysis
   ├── Pinata API → IPFS upload
   └── ethers.js → Blockchain tx (Polygon)`}</pre>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            <strong className="text-foreground">Frontend Role:</strong> Wallet connect, Profile view, Leaderboard, Public contribution feed
          </p>
        </section>

        {/* Roadmap */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Zap className="w-8 h-8 text-primary" />
            Roadmap (Upcoming CLI Features)
          </h2>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> <code className="text-primary text-sm">commitchain history</code> → View past contributions</li>
            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> <code className="text-primary text-sm">commitchain reputation</code> → Check on-chain reputation</li>
            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> GitHub auto-linking (repo metadata)</li>
            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> MetaMask secure signing (no private key flag)</li>
            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> AI merge conflict auto-resolution</li>
            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> CI/CD integration (GitHub Actions)</li>
          </ul>
        </section>

        {/* Why CommitChain CLI */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-primary" />
            Why CommitChain CLI?
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: Link2, text: "On-chain verifiable contributions" },
              { icon: Brain, text: "AI-powered code analysis" },
              { icon: Pin, text: "Permanent IPFS proof storage" },
              { icon: Trophy, text: "Decentralized reputation system" },
              { icon: Terminal, text: "Developer-first CLI workflow" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 rounded-xl border border-border/30 bg-secondary/20 p-4">
                <Icon className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* License & Support */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-border/30 bg-secondary/20 p-6">
              <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                <FileCode className="w-5 h-5 text-primary" />
                License
              </h3>
              <p className="text-sm text-muted-foreground">MIT License © CommitChain</p>
            </div>
            <div className="rounded-xl border border-border/30 bg-secondary/20 p-6">
              <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-primary" />
                Support
              </h3>
              <p className="text-sm text-muted-foreground">
                For issues, feature requests, or bugs: GitHub Issues, Website (commitchain.xyz)
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-16 border-t border-border/30">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Building?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Submit your first contribution and start earning on-chain reputation.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:opacity-90 hover:shadow-lg hover:shadow-primary/30 transition-all"
          >
            Launch Dashboard
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 py-8 text-center text-sm text-muted-foreground relative z-10 space-y-2">
        <p>CommitChain · AI-Powered Decentralized Contribution Protocol · 2026</p>
        <RotatingMadeBy />
      </footer>
    </div>
  );
}
