"use client";

import Link from "next/link";
import {
  ArrowRight,
  Code2,
  Shield,
  Zap,
  BarChart3,
  Brain,
  Lock,
} from "lucide-react";
import { InteractiveBackground } from "@/components/InteractiveBackground";
import { RotatingMadeBy } from "@/components/RotatingMadeBy";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
      <InteractiveBackground />
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-border/20 bg-background/90 backdrop-blur-md relative">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">CommitChain</span>
            </div>
            <div className="hidden sm:flex items-center gap-8">
              <a
                href="#features"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
              >
                Features
              </a>
              <a
                href="#how"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
              >
                How It Works
              </a>
              <Link
                href="/docs"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
              >
                Docs
              </Link>
              <a
                href="#stats"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
              >
                Stats
              </a>
            </div>
            <Link
              href="/dashboard"
              className="px-6 py-2 rounded-lg bg-primary text-black font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20"
            >
              Launch App
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-4 sm:px-6 lg:px-8 z-10">
        <div className="absolute inset-0 bg-grid opacity-5" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold mb-8 leading-tight tracking-tight">
              <span className="text-foreground">AI-Powered</span>{" "}
              <span className="text-primary">Decentralized</span>
              <br />
              <span className="text-foreground">Contribution Protocol</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-12 leading-relaxed max-w-2xl mx-auto">
              Submit code contributions, get AI analysis, pin proof to IPFS, and
              earn on-chain reputation on Polygon.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="px-8 py-3.5 rounded-xl bg-primary text-black font-bold text-base hover:opacity-90 hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
              >
                Get Started <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/docs"
                className="px-8 py-3.5 rounded-xl border-2 border-border bg-transparent hover:border-primary/50 hover:bg-primary/5 transition-all font-bold text-base"
              >
                Read Docs
              </Link>
            </div>

            {/* Terminal Demo */}
            <div className="mt-16 max-w-2xl mx-auto">
              <div className="rounded-2xl border border-border/30 bg-secondary/20 backdrop-blur-sm overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border/20 bg-secondary/30">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono ml-2">
                    terminal
                  </span>
                </div>
                <div className="p-6 font-mono text-sm text-muted-foreground space-y-2">
                  <div className="text-foreground">
                    $ <span className="text-primary">commitchain</span> submit
                    --repo ./my-project
                  </div>
                  <div>✓ Analyzing 24 files...</div>
                  <div>
                    ✓ AI Score:{" "}
                    <span className="text-primary font-bold">94/100</span>
                  </div>
                  <div>
                    ✓ Pinned to IPFS:{" "}
                    <span className="text-accent">QmX7...k9F2</span>
                  </div>
                  <div>
                    ✓ Reputation minted on{" "}
                    <span className="text-primary font-bold">Polygon</span>
                  </div>
                  <div className="text-green-500">Done in 1.8s ✓</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-4 sm:px-6 lg:px-8 relative z-10">
        <div>
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-4">Powerful Features</h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to showcase your contributions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl border border-border/30 bg-secondary/20 hover:border-primary/40 hover:bg-secondary/30 transition-all group">
              <div className="w-12 h-12 rounded-lg bg-primary/15 flex items-center justify-center mb-5 group-hover:bg-primary/25 transition-colors">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI Analysis</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Powered by Google Gemini, get instant analysis of your code
                contributions with impact scoring.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl border border-border/30 bg-secondary/20 hover:border-primary/40 hover:bg-secondary/30 transition-all group">
              <div className="w-12 h-12 rounded-lg bg-primary/15 flex items-center justify-center mb-5 group-hover:bg-primary/25 transition-colors">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">IPFS Storage</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Your contribution proofs permanently stored on IPFS via Pinata,
                ensuring immutable records.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl border border-border/30 bg-secondary/20 hover:border-primary/40 hover:bg-secondary/30 transition-all group">
              <div className="w-12 h-12 rounded-lg bg-primary/15 flex items-center justify-center mb-5 group-hover:bg-primary/25 transition-colors">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">On-Chain Reputation</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Build verifiable reputation on Polygon blockchain. Earn tokens
                and track transparently.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 rounded-2xl border border-border/30 bg-secondary/20 hover:border-primary/40 hover:bg-secondary/30 transition-all group">
              <div className="w-12 h-12 rounded-lg bg-primary/15 flex items-center justify-center mb-5 group-hover:bg-primary/25 transition-colors">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Secure & Verified</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                All contributions cryptographically verified and stored securely
                on blockchain.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 rounded-2xl border border-border/30 bg-secondary/20 hover:border-primary/40 hover:bg-secondary/30 transition-all group">
              <div className="w-12 h-12 rounded-lg bg-primary/15 flex items-center justify-center mb-5 group-hover:bg-primary/25 transition-colors">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Instant Submissions</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Submit with one click. Get AI analysis and on-chain recording in
                seconds.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 rounded-2xl border border-border/30 bg-secondary/20 hover:border-primary/40 hover:bg-secondary/30 transition-all group">
              <div className="w-12 h-12 rounded-lg bg-primary/15 flex items-center justify-center mb-5 group-hover:bg-primary/25 transition-colors">
                <Code2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Developer Tools</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                CLI tools and SDK for seamless integration into your development
                workflow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="how"
        className="py-32 px-4 sm:px-6 lg:px-8 border-t border-border/30 relative z-10"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-8">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-12">
            Join the decentralized contribution revolution. Submit your first
            contribution today.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-black font-bold text-lg hover:opacity-90 hover:shadow-lg hover:shadow-primary/30 transition-all shadow-lg shadow-primary/20"
          >
            Launch Dashboard <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="stats"
        className="border-t border-border/30 py-16 px-4 sm:px-6 lg:px-8 relative z-10"
      >
        <div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Code2 className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-lg">CommitChain</span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered decentralized contribution protocol on Polygon
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-foreground">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#features"
                    className="hover:text-foreground transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#how"
                    className="hover:text-foreground transition-colors"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <Link
                    href="/docs"
                    className="hover:text-foreground transition-colors"
                  >
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-foreground">Community</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Discord
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-foreground">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/30 pt-8 text-center text-sm text-muted-foreground space-y-2">
            <p>
              &copy; 2026 CommitChain. Decentralized contribution protocol. All
              rights reserved.
            </p>
            <RotatingMadeBy />
          </div>
        </div>
      </footer>
    </div>
  );
}
