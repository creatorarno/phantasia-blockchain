import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  Zap,
  Brain,
  CloudUpload,
  Link2,
  GitBranch,
  Folder,
  Terminal,
  LayoutDashboard,
  Package,
  CheckCircle2,
  Code2,
  Shield,
  AlertTriangle,
  Tag,
  Lightbulb,
  Lock,
  Bug,
  Server,
  Rocket,
  Trophy,
  FileText,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ═══════════════════════════════════════════════════════════════
//  DOCS PAGE — Same M3 dark theme as landing + dashboard
// ═══════════════════════════════════════════════════════════════

const sidebarNav = [
  { label: "Overview", href: "#overview" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Installation", href: "#installation" },
  { label: "Requirements", href: "#requirements" },
  { label: "Basic Usage", href: "#usage" },
  { label: "CLI Output", href: "#cli-output" },
  { label: "Commands", href: "#commands" },
  { label: "AI Analysis", href: "#ai" },
  { label: "IPFS Storage", href: "#ipfs" },
  { label: "Blockchain", href: "#blockchain" },
  { label: "Dashboard", href: "#dashboard" },
  { label: "Security", href: "#security" },
  { label: "Errors", href: "#errors" },
  { label: "Environment", href: "#environment" },
  { label: "Architecture", href: "#architecture" },
  { label: "Roadmap", href: "#roadmap" },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-surface text-on-surface font-body relative">
      {/* Background ambient glows */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary/5 blur-[120px] rounded-full" />
      </div>

      {/* ─── TOP NAVBAR ───────────────────────────────────────── */}
      <nav className="bg-[#131315]/80 backdrop-blur-xl sticky top-0 z-50 shadow-[0_4px_20px_rgba(124,58,237,0.04)]">
        <div className="flex justify-between items-center w-full px-4 sm:px-8 py-3 sm:py-4 max-w-[1440px] mx-auto">
          <div className="flex items-center gap-6 sm:gap-8">
            <Link
              href="/"
              className="text-xl sm:text-2xl font-bold tracking-tighter text-primary italic font-headline hover:text-primary/80 transition-colors"
            >
              CommitChain
            </Link>
            <div className="hidden md:flex gap-6 items-center">
              <Link
                className="text-on-surface-variant hover:text-primary transition-colors font-label text-sm"
                href="/dashboard"
              >
                Dashboard
              </Link>

              <Link
                className="text-primary border-b-2 border-primary pb-1 font-label text-sm"
                href="/docs"
              >
                Docs
              </Link>
            </div>
          </div>

          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </nav>

      {/* ─── MAIN LAYOUT ─────────────────────────────────────── */}
      <div className="max-w-[1440px] mx-auto flex relative">
        {/* Sidebar navigation */}
        <aside className="hidden lg:block w-64 shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto py-8 px-6 border-r border-outline-variant/10">
          <p className="text-[10px] font-mono text-on-surface-variant uppercase tracking-[0.2em] mb-4">
            Documentation
          </p>
          <nav className="space-y-1">
            {sidebarNav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block text-sm text-on-surface-variant hover:text-primary transition-colors py-1.5 px-3 rounded-lg hover:bg-surface-container-low"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 px-4 sm:px-8 lg:px-16 py-10 sm:py-16">
          {/* ─── HEADER ──────────────────────────────────────── */}
          <div className="mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-surface-container-high border border-outline-variant/20">
              <span className="w-2 h-2 rounded-full bg-secondary neon-glow animate-pulse" />
              <span className="text-[10px] sm:text-xs font-mono text-on-surface-variant tracking-widest uppercase">
                v1.0 • Open Source
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-headline tracking-tighter leading-tight mb-4">
              <span className="bg-gradient-to-b from-on-surface to-on-surface-variant bg-clip-text text-transparent">
                CommitChain CLI
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-on-surface-variant max-w-2xl leading-relaxed">
              <code className="text-primary font-mono text-base">
                @commitchain/cli
              </code>{" "}
              — AI-Powered Decentralized Contribution Tool. Submit verifiable
              code contributions on-chain with AI analysis and IPFS proof.
            </p>
          </div>

          {/* ─── OVERVIEW ────────────────────────────────────── */}
          <section id="overview" className="mb-16 scroll-mt-20">
            <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-outline-variant/10">
              <SectionHeading Icon={Zap} title="Overview" />
              <p className="text-on-surface-variant leading-relaxed mb-4">
                <strong className="text-on-surface">CommitChain CLI</strong> is
                a developer tool that allows you to submit code contributions
                directly from your local Git repository to the CommitChain
                protocol.
              </p>
              <p className="text-on-surface-variant leading-relaxed mb-8">
                It extracts your git diff, analyzes code using AI (Gemini),
                uploads contribution data to IPFS (Pinata), and records proof +
                reputation on Polygon blockchain. This creates a{" "}
                <strong className="text-on-surface">
                  tamper-proof, AI-verified contribution history
                </strong>{" "}
                tied to your wallet.
              </p>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  {
                    Icon: Brain,
                    label: "AI Analysis",
                    desc: "Gemini evaluates code quality, security, and impact",
                    color: "text-primary",
                  },
                  {
                    Icon: CloudUpload,
                    label: "IPFS Storage",
                    desc: "Immutable proof stored permanently via Pinata",
                    color: "text-secondary",
                  },
                  {
                    Icon: Link2,
                    label: "On-Chain Record",
                    desc: "Proof + reputation on Polygon blockchain",
                    color: "text-tertiary",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl bg-surface-container-low border border-outline-variant/10 p-5"
                  >
                    <item.Icon className={`w-6 h-6 ${item.color} mb-3`} />
                    <h3 className="font-bold text-sm font-headline mb-1">
                      {item.label}
                    </h3>
                    <p className="text-xs text-on-surface-variant">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ─── HOW IT WORKS ────────────────────────────────── */}
          <section id="how-it-works" className="mb-16 scroll-mt-20">
            <SectionHeading Icon={GitBranch} title="How It Works" />
            <div className="glass-panel rounded-xl p-6 sm:p-8 border border-outline-variant/10">
              <div className="space-y-0">
                {[
                  {
                    step: "01",
                    label: "Local Git Repo",
                    desc: "Extract diff from your latest commits",
                    Icon: Folder,
                  },
                  {
                    step: "02",
                    label: "CommitChain CLI",
                    desc: "commitchain submit",
                    Icon: Terminal,
                  },
                  {
                    step: "03",
                    label: "AI Analysis",
                    desc: "Gemini evaluates quality, impact, security",
                    Icon: Brain,
                  },
                  {
                    step: "04",
                    label: "IPFS Storage",
                    desc: "Pinata CID — permanent proof",
                    Icon: CloudUpload,
                  },
                  {
                    step: "05",
                    label: "Blockchain Recording",
                    desc: "Recorded on Polygon Amoy",
                    Icon: Link2,
                  },
                  {
                    step: "06",
                    label: "Dashboard",
                    desc: "Profile + Leaderboard",
                    Icon: LayoutDashboard,
                  },
                ].map((item, i) => (
                  <div
                    key={item.step}
                    className="flex items-start gap-4 py-4 border-b border-outline-variant/10 last:border-b-0"
                  >
                    <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-mono font-bold text-primary">
                        {item.step}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <item.Icon className="w-4 h-4 text-on-surface-variant" />
                        <h4 className="font-bold text-on-surface font-headline text-sm">
                          {item.label}
                        </h4>
                      </div>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                    {i < 5 && (
                      <ArrowDown className="w-4 h-4 text-outline-variant mt-1" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ─── INSTALLATION ────────────────────────────────── */}
          <section id="installation" className="mb-16 scroll-mt-20">
            <SectionHeading Icon={Package} title="Installation" />
            <p className="text-on-surface-variant mb-4">
              Install the CLI globally via npm:
            </p>
            <div className="space-y-4">
              <CodeBlock label="Install globally">
                <span className="text-on-surface-variant">$</span>{" "}
                <span className="text-primary">
                  npm install -g @commitchain/cli
                </span>
              </CodeBlock>
              <CodeBlock label="Verify installation">
                <span className="text-on-surface-variant">$</span>{" "}
                <span className="text-primary">commitchain --version</span>
              </CodeBlock>
            </div>
          </section>

          {/* ─── REQUIREMENTS ────────────────────────────────── */}
          <section id="requirements" className="mb-16 scroll-mt-20">
            <SectionHeading Icon={CheckCircle2} title="Requirements" />
            <p className="text-on-surface-variant mb-4">
              Before using CommitChain CLI, ensure you have:
            </p>
            <div className="space-y-2">
              {[
                "Node.js ≥ 18",
                "Git installed and initialized in your project",
                "A GitHub-connected repository (recommended)",
                "MetaMask wallet private key (for signing transactions)",
                "Internet connection (AI + IPFS + Blockchain)",
              ].map((req) => (
                <div key={req} className="flex items-center gap-3 py-2">
                  <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0" />
                  <span className="text-sm text-on-surface-variant">{req}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ─── BASIC USAGE ─────────────────────────────────── */}
          <section id="usage" className="mb-16 scroll-mt-20">
            <SectionHeading Icon={Terminal} title="Basic Usage" />
            <h3 className="text-lg font-bold font-headline mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-secondary" />
              Submit a Contribution
            </h3>
            <div className="glass-panel rounded-xl p-6 sm:p-8 border border-outline-variant/10 space-y-4">
              <CodeBlock label="Command">
                <span className="text-primary">commitchain submit</span>{" "}
                <span className="text-tertiary">--title</span>{" "}
                <span className="text-on-surface">
                  &quot;Your change title&quot;
                </span>{" "}
                <span className="text-tertiary">--private-key</span>{" "}
                <span className="text-on-surface">
                  &quot;YOUR_PRIVATE_KEY&quot;
                </span>
              </CodeBlock>
              <p className="text-xs font-mono text-on-surface-variant uppercase tracking-wider">
                Example:
              </p>
              <CodeBlock label="Example">
                <span className="text-primary">commitchain submit</span>{" "}
                <span className="text-tertiary">--title</span>{" "}
                <span className="text-on-surface">
                  &quot;Refactored authentication logic&quot;
                </span>{" "}
                <span className="text-tertiary">--private-key</span>{" "}
                <span className="text-on-surface">&quot;0xabc123...&quot;</span>
              </CodeBlock>
              <p className="text-sm text-on-surface-variant">
                This will: extract git diff → analyze with AI → upload to IPFS →
                record on-chain → update reputation.
              </p>
            </div>
          </section>

          {/* ─── CLI OUTPUT ───────────────────────────────────── */}
          <section id="cli-output" className="mb-16 scroll-mt-20">
            <SectionHeading Icon={Terminal} title="CLI Output Explained" />
            <div className="glass-panel rounded-xl overflow-hidden border border-outline-variant/10">
              {/* Terminal header */}
              <div className="bg-surface-container-high/50 p-3 sm:p-4 border-b border-outline-variant/30 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                <span className="ml-4 font-mono text-[10px] text-on-surface-variant opacity-60">
                  COMMITCHAIN_CLI // SUBMIT_OUTPUT
                </span>
              </div>
              <div className="p-4 sm:p-6 font-mono text-xs sm:text-sm text-on-surface-variant whitespace-pre overflow-x-auto leading-relaxed">
                {`╔══════════════════════════════════════════╗
║      CommitChain — Submit Contribution   ║
╚══════════════════════════════════════════╝

▸ Step 1 — Extracting git diff
  Diff lines: 13
  Title: First commit hehe :3
  Branch: main

▸ Step 2 — Wallet
  Wallet: 0x8F1C...CE49

▸ Step 3 — AI Analysis + IPFS
  Summary: Code improvement and minor refactor
  Impact: `}
                <span className="text-primary">5/10</span>
                {`
  Risk: `}
                <span className="text-secondary">low</span>
                {`
  IPFS CID: QmXXXX...
  Gateway: https://gateway.pinata.cloud/ipfs/...

▸ Step 4 — Recording on-chain
  TX Hash: 0x...
  `}
                <span className="text-secondary">
                  Contribution recorded successfully!
                </span>
                {`
  `}
                <span className="text-primary">
                  Reputation +10 earned on-chain
                </span>
              </div>
            </div>
          </section>

          {/* ─── COMMAND REFERENCE ────────────────────────────── */}
          <section id="commands" className="mb-16 scroll-mt-20">
            <SectionHeading Icon={Code2} title="Command Reference" />
            <div className="space-y-6">
              {/* Command 1 */}
              <div className="glass-panel rounded-xl p-6 sm:p-8 border border-outline-variant/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center">
                    <span className="text-xs font-mono font-bold text-primary">
                      01
                    </span>
                  </div>
                  <h3 className="text-lg font-bold font-headline">
                    commitchain submit
                  </h3>
                </div>
                <p className="text-sm text-on-surface-variant mb-4">
                  Submit a new contribution to the protocol.
                </p>
                <CodeBlock label="Syntax">
                  <span className="text-primary">commitchain submit</span>{" "}
                  <span className="text-tertiary">--title</span>{" "}
                  <span className="text-on-surface">
                    &quot;&lt;title&gt;&quot;
                  </span>{" "}
                  <span className="text-tertiary">--private-key</span>{" "}
                  <span className="text-on-surface">
                    &quot;&lt;wallet_private_key&gt;&quot;
                  </span>
                </CodeBlock>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-outline-variant/20">
                        <th className="text-left py-2 font-mono text-[10px] text-on-surface-variant uppercase tracking-widest">
                          Flag
                        </th>
                        <th className="text-left py-2 font-mono text-[10px] text-on-surface-variant uppercase tracking-widest">
                          Type
                        </th>
                        <th className="text-left py-2 font-mono text-[10px] text-on-surface-variant uppercase tracking-widest">
                          Required
                        </th>
                        <th className="text-left py-2 font-mono text-[10px] text-on-surface-variant uppercase tracking-widest">
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-on-surface-variant">
                      <tr className="border-b border-outline-variant/10">
                        <td className="py-3 font-mono text-tertiary">
                          --title
                        </td>
                        <td className="py-3">string</td>
                        <td className="py-3 text-secondary">Yes</td>
                        <td className="py-3">
                          Title/description of the contribution
                        </td>
                      </tr>
                      <tr className="border-b border-outline-variant/10">
                        <td className="py-3 font-mono text-tertiary">
                          --private-key
                        </td>
                        <td className="py-3">string</td>
                        <td className="py-3 text-secondary">Yes</td>
                        <td className="py-3">
                          User wallet private key for signing tx
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Command 2 */}
              <div className="glass-panel rounded-xl p-6 sm:p-8 border border-outline-variant/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center">
                    <span className="text-xs font-mono font-bold text-primary">
                      02
                    </span>
                  </div>
                  <h3 className="text-lg font-bold font-headline">
                    commitchain --help
                  </h3>
                </div>
                <p className="text-sm text-on-surface-variant mb-4">
                  Show all available commands and usage instructions.
                </p>
                <CodeBlock label="Usage">
                  <span className="text-on-surface-variant">$</span>{" "}
                  <span className="text-primary">commitchain --help</span>
                </CodeBlock>
              </div>
            </div>
          </section>

          {/* ─── AI ANALYSIS ─────────────────────────────────── */}
          <section id="ai" className="mb-16 scroll-mt-20">
            <SectionHeading Icon={Brain} title="AI Analysis System (Gemini)" />
            <p className="text-on-surface-variant mb-6">
              CommitChain uses AI to automatically evaluate contributions.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { Icon: Brain, label: "Summary of code changes" },
                { Icon: Zap, label: "Impact score (0–10)" },
                { Icon: Code2, label: "Code quality score" },
                { Icon: Shield, label: "Security analysis" },
                { Icon: GitBranch, label: "Complexity level" },
                { Icon: AlertTriangle, label: "Risk assessment" },
                {
                  Icon: Tag,
                  label: "Contribution type (feature, bugfix, chore, refactor)",
                },
                { Icon: Lightbulb, label: "Improvement suggestions" },
              ].map(({ Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-xl bg-surface-container-low border border-outline-variant/10 px-4 py-3"
                >
                  <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-sm text-on-surface-variant">
                    {label}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-sm text-on-surface-variant mt-4">
              This AI report is stored permanently on IPFS and linked on-chain.
            </p>
          </section>

          {/* ─── IPFS STORAGE ────────────────────────────────── */}
          <section id="ipfs" className="mb-16 scroll-mt-20">
            <SectionHeading
              Icon={CloudUpload}
              title="IPFS Storage (Proof Layer)"
            />
            <p className="text-on-surface-variant mb-4">
              Each submission uploads a JSON payload to IPFS containing:
            </p>
            <div className="glass-panel rounded-xl overflow-hidden border border-outline-variant/10">
              <div className="bg-surface-container-high/50 p-3 border-b border-outline-variant/30 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                <span className="ml-4 font-mono text-[10px] text-on-surface-variant opacity-60">
                  IPFS_PAYLOAD.json
                </span>
              </div>
              <div className="p-4 sm:p-6">
                <pre className="font-mono text-xs sm:text-sm text-on-surface-variant overflow-x-auto">
                  {`{
  "title": "Fix login bug",
  "diff": "...git diff...",
  "aiReport": {
    "summary": "...",
    "impact": `}
                  <span className="text-primary">7</span>
                  {`,
    "quality": `}
                  <span className="text-secondary">8</span>
                  {`
  },
  "timestamp": 123456789
}`}
                </pre>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm text-on-surface-variant">
              <p>
                Returned CID example:{" "}
                <code className="text-primary font-mono text-xs">
                  QmRT52SACuDLvMJ5cEXATmfhhiVYQFZiGpY6YDFFS69Hnc
                </code>
              </p>
              <p>This CID acts as permanent proof of contribution.</p>
            </div>
          </section>

          {/* ─── BLOCKCHAIN ──────────────────────────────────── */}
          <section id="blockchain" className="mb-16 scroll-mt-20">
            <SectionHeading
              Icon={Link2}
              title="Blockchain Integration (Polygon Amoy)"
            />
            <p className="text-on-surface-variant mb-4">
              After IPFS upload, the CLI:
            </p>
            <div className="space-y-2 mb-6">
              {[
                <>
                  Calls{" "}
                  <code className="text-primary font-mono text-xs">
                    submitContribution(title, cid)
                  </code>
                </>,
                "Records contribution immutably",
                "Updates on-chain reputation (+10 per contribution)",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 py-2">
                  <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0" />
                  <span className="text-sm text-on-surface-variant">
                    {item}
                  </span>
                </div>
              ))}
            </div>
            <div className="glass-panel rounded-xl p-6 border border-outline-variant/10">
              <p className="text-[10px] font-mono text-on-surface-variant uppercase tracking-widest mb-4">
                Stored On-Chain
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  "Wallet Address",
                  "Title",
                  "IPFS CID",
                  "Timestamp",
                  "Reputation",
                ].map((field) => (
                  <div
                    key={field}
                    className="rounded-lg bg-surface-container-lowest px-3 py-2 text-center"
                  >
                    <span className="text-xs font-mono text-primary">
                      {field}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ─── DASHBOARD ───────────────────────────────────── */}
          <section id="dashboard" className="mb-16 scroll-mt-20">
            <SectionHeading
              Icon={LayoutDashboard}
              title="User Profile & Dashboard"
            />
            <p className="text-on-surface-variant mb-4">
              After submitting contributions, users can:
            </p>
            <div className="space-y-2 mb-6">
              {[
                "Connect wallet on CommitChain website",
                "View personal contribution history",
                "Check AI scores",
                "Track reputation level",
                "View global leaderboard",
                "Explore public decentralized feed",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 py-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="text-sm text-on-surface-variant">
                    {item}
                  </span>
                </div>
              ))}
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-surface-container-highest text-primary px-6 py-3 rounded-lg font-bold text-sm hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-surface-container-highest/20"
            >
              <ExternalLink className="w-4 h-4" />
              Launch Dashboard
            </Link>
          </section>

          {/* ─── SECURITY ────────────────────────────────────── */}
          <section id="security" className="mb-16 scroll-mt-20">
            <SectionHeading Icon={Lock} title="Security Notice" />
            <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-bold font-headline text-yellow-400">
                  Private Key Usage
                </h3>
              </div>
              <p className="text-sm text-on-surface-variant mb-4">
                The{" "}
                <code className="text-tertiary font-mono">--private-key</code>{" "}
                flag is used <strong className="text-on-surface">ONLY</strong>{" "}
                to sign blockchain transactions locally. It is never stored by
                CommitChain servers.
              </p>
              <p className="text-[10px] font-mono text-on-surface-variant uppercase tracking-widest mb-3">
                Best Practices
              </p>
              <div className="space-y-2 mb-4">
                {[
                  "Use a burner wallet for testing",
                  "Never expose main wallet private key",
                  "Do NOT commit private keys to GitHub",
                ].map((tip) => (
                  <div key={tip} className="flex items-center gap-3 py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                    <span className="text-sm text-on-surface-variant">
                      {tip}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-on-surface-variant">
                Recommended (future):{" "}
                <code className="text-primary font-mono text-xs">
                  commitchain submit --metamask
                </code>{" "}
                for secure wallet signing
              </p>
            </div>
          </section>

          {/* ─── ERRORS ──────────────────────────────────────── */}
          <section id="errors" className="mb-16 scroll-mt-20">
            <SectionHeading Icon={Bug} title="Error Handling" />
            <p className="text-[10px] font-mono text-on-surface-variant uppercase tracking-widest mb-4">
              Common Errors & Fixes
            </p>
            <div className="space-y-4">
              {[
                {
                  error: '"No git diff found"',
                  fix: (
                    <CodeBlock label="Fix">
                      <span className="text-primary">git add</span> .{"\n"}
                      <span className="text-primary">git commit</span>{" "}
                      <span className="text-on-surface">
                        -m &quot;Your changes&quot;
                      </span>
                    </CodeBlock>
                  ),
                },
                {
                  error: "Invalid private key",
                  fix: (
                    <p className="text-sm text-on-surface-variant">
                      Ensure: starts with{" "}
                      <code className="text-primary font-mono">0x</code>,
                      correct length (64 hex chars)
                    </p>
                  ),
                },
                {
                  error: "Network / RPC error",
                  fix: (
                    <p className="text-sm text-on-surface-variant">
                      Check: Internet connection, Polygon Amoy RPC availability
                    </p>
                  ),
                },
              ].map(({ error, fix }) => (
                <div
                  key={error}
                  className="glass-panel rounded-xl p-5 sm:p-6 border border-outline-variant/10"
                >
                  <p className="font-mono text-sm text-red-400 mb-3">{error}</p>
                  {fix}
                </div>
              ))}
            </div>
          </section>

          {/* ─── ENVIRONMENT ─────────────────────────────────── */}
          <section id="environment" className="mb-16 scroll-mt-20">
            <SectionHeading Icon={CheckCircle2} title="Supported Environment" />
            <div className="glass-panel rounded-xl overflow-hidden border border-outline-variant/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-outline-variant/20">
                    <th className="text-left px-4 sm:px-6 py-3 font-mono text-[10px] text-on-surface-variant uppercase tracking-widest">
                      Feature
                    </th>
                    <th className="text-left px-4 sm:px-6 py-3 font-mono text-[10px] text-on-surface-variant uppercase tracking-widest">
                      Support
                    </th>
                  </tr>
                </thead>
                <tbody className="text-on-surface-variant">
                  {[
                    {
                      feature: "Git Repositories",
                      support: "Yes",
                      color: "text-secondary",
                    },
                    {
                      feature: "GitHub Projects",
                      support: "Recommended",
                      color: "text-secondary",
                    },
                    {
                      feature: "Local Repos",
                      support: "Supported",
                      color: "text-secondary",
                    },
                    {
                      feature: "Monorepos",
                      support: "Partial",
                      color: "text-yellow-400",
                    },
                    {
                      feature: "Private Repos",
                      support: "Yes",
                      color: "text-secondary",
                    },
                  ].map(({ feature, support, color }) => (
                    <tr
                      key={feature}
                      className="border-b border-outline-variant/10"
                    >
                      <td className="px-4 sm:px-6 py-3">{feature}</td>
                      <td className={`px-4 sm:px-6 py-3 font-mono ${color}`}>
                        {support}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ─── ARCHITECTURE ────────────────────────────────── */}
          <section id="architecture" className="mb-16 scroll-mt-20">
            <SectionHeading Icon={Server} title="Architecture Summary" />
            <div className="glass-panel rounded-xl overflow-hidden border border-outline-variant/10">
              <div className="bg-surface-container-high/50 p-3 border-b border-outline-variant/30 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                <span className="ml-4 font-mono text-[10px] text-on-surface-variant opacity-60">
                  SYSTEM_ARCH
                </span>
              </div>
              <div className="p-4 sm:p-6">
                <pre className="font-mono text-xs sm:text-sm text-on-surface-variant whitespace-pre">
                  {`CLI (Node.js)
   ├── simple-git → `}
                  <span className="text-primary">Extract diff</span>
                  {`
   ├── Gemini API → `}
                  <span className="text-primary">AI analysis</span>
                  {`
   ├── Pinata API → `}
                  <span className="text-secondary">IPFS upload</span>
                  {`
   └── ethers.js  → `}
                  <span className="text-tertiary">Blockchain tx (Polygon)</span>
                </pre>
              </div>
            </div>
            <p className="text-sm text-on-surface-variant mt-4">
              <strong className="text-on-surface">Frontend Role:</strong> Wallet
              connect, Profile view, Leaderboard, Public contribution feed
            </p>
          </section>

          {/* ─── ROADMAP ─────────────────────────────────────── */}
          <section id="roadmap" className="mb-16 scroll-mt-20">
            <SectionHeading Icon={Rocket} title="Roadmap" />
            <div className="space-y-3">
              {[
                { cmd: "commitchain history", desc: "View past contributions" },
                {
                  cmd: "commitchain reputation",
                  desc: "Check on-chain reputation",
                },
                { cmd: null, desc: "GitHub auto-linking (repo metadata)" },
                {
                  cmd: null,
                  desc: "MetaMask secure signing (no private key flag)",
                },
                { cmd: null, desc: "AI merge conflict auto-resolution" },
                { cmd: null, desc: "CI/CD integration (GitHub Actions)" },
              ].map(({ cmd, desc }) => (
                <div key={desc} className="flex items-center gap-3 py-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="text-sm text-on-surface-variant">
                    {cmd && (
                      <code className="text-primary font-mono text-xs mr-2">
                        {cmd}
                      </code>
                    )}
                    {cmd ? "→ " : ""}
                    {desc}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* ─── WHY + LICENSE ────────────────────────────────── */}
          <section className="mb-16">
            <SectionHeading Icon={Trophy} title="Why CommitChain CLI?" />
            <div className="grid sm:grid-cols-2 gap-3 mb-12">
              {[
                { Icon: Link2, text: "On-chain verifiable contributions" },
                { Icon: Brain, text: "AI-powered code analysis" },
                { Icon: CloudUpload, text: "Permanent IPFS proof storage" },
                { Icon: Trophy, text: "Decentralized reputation system" },
                { Icon: Terminal, text: "Developer-first CLI workflow" },
              ].map(({ Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-3 rounded-xl bg-surface-container-low border border-outline-variant/10 p-4"
                >
                  <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm font-medium text-on-surface">
                    {text}
                  </span>
                </div>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="glass-panel rounded-xl p-6 border border-outline-variant/10">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-bold font-headline">License</h3>
                </div>
                <p className="text-sm text-on-surface-variant">
                  MIT License © CommitChain
                </p>
              </div>
              <div className="glass-panel rounded-xl p-6 border border-outline-variant/10">
                <div className="flex items-center gap-2 mb-2">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-bold font-headline">Support</h3>
                </div>
                <p className="text-sm text-on-surface-variant">
                  For issues, feature requests, or bugs: GitHub Issues, Website
                  (commitchain.xyz)
                </p>
              </div>
            </div>
          </section>

          {/* ─── BOTTOM CTA ──────────────────────────────────── */}
          <section className="glass-panel rounded-2xl p-8 sm:p-12 text-center border border-outline-variant/10 relative overflow-hidden">
            <div
              className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 50% 50%, #7c3aed 0%, transparent 70%)",
              }}
            />
            <h2 className="text-3xl sm:text-4xl font-bold font-headline tracking-tight mb-4 relative z-10">
              Ready to Start Building?
            </h2>
            <p className="text-lg text-on-surface-variant mb-8 max-w-xl mx-auto relative z-10">
              Submit your first contribution and start earning on-chain
              reputation.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-white text-background px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform relative z-10"
            >
              Launch Dashboard
              <ArrowRight className="w-5 h-5" />
            </Link>
          </section>
        </main>
      </div>

      {/* ─── FOOTER ──────────────────────────────────────────── */}
      <footer className="w-full py-8 sm:py-12 px-4 sm:px-8 bg-surface border-t border-outline-variant/10 mt-16">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-on-surface-variant">
            CommitChain · AI-Powered Decentralized Contribution Protocol · 2026
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm text-on-surface-variant hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className="text-sm text-on-surface-variant hover:text-primary transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/docs"
              className="text-sm text-on-surface-variant hover:text-primary transition-colors"
            >
              Docs
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Reusable sub-components ──────────────────────────────────────

function SectionHeading({ Icon, title }: { Icon: LucideIcon; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <Icon className="w-6 h-6 text-primary" />
      <h2 className="text-2xl sm:text-3xl font-bold font-headline tracking-tight">
        {title}
      </h2>
    </div>
  );
}

function CodeBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-surface-container-lowest border border-outline-variant/10 overflow-hidden">
      <div className="px-4 py-1.5 bg-surface-container-high/30 border-b border-outline-variant/10">
        <span className="text-[9px] font-mono text-on-surface-variant uppercase tracking-widest">
          {label}
        </span>
      </div>
      <div className="p-4 font-mono text-sm text-on-surface-variant whitespace-pre-wrap">
        {children}
      </div>
    </div>
  );
}
