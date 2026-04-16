import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-[100svh] sm:min-h-[921px] flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Background Visual: Cryptographic Mesh */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(210,187,255,0.1),transparent,transparent)]" />
        <div
          className="w-full h-full bg-center bg-cover"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCoChnd0qMxFFgVFk1Q0UGcT58baPB3wZm9-3qqJVgji9lX2c9Z-XGm8lcp4sDQo1kbMSpwcp0Tgc3O9_W03ft8oXiYJXtD08QXtq5FNAT1pCPmJTd4QywmFEe0fPZnVNK8HP9sAp47bbPzlnmcjHL4HBn3JLV6b8hHsk7kBPnbKbC7SzNg1-LRhyfuNeRImfsOhGO6cVyIAt7FA89tPkh298WfZ3u2PNCzQ8BibaaNp_RdhiBQ0W4gwDd5JGuBnfSn5wLlYl2UHIY')",
          }}
        />
      </div>

      <div className="relative z-10 text-center max-w-5xl w-full">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 sm:mb-8 rounded-full bg-surface-container-high border border-outline-variant/20">
          <span className="w-2 h-2 rounded-full bg-secondary neon-glow animate-pulse flex-shrink-0" />
          <span className="text-[10px] sm:text-xs font-mono text-on-surface-variant tracking-widest uppercase">
            Protocol Live on Polygon Mainnet
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold tracking-tighter leading-[1.1] sm:leading-none mb-4 sm:mb-6 bg-gradient-to-b from-on-surface to-on-surface-variant bg-clip-text text-transparent">
          The Sovereign Proof <br /> of Contribution
        </h1>

        {/* Subheadline */}
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-on-surface-variant font-light max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed px-2">
          Track, verify, and monetize your open-source impact with{" "}
          <span className="text-primary">AI-powered analysis</span> on Polygon.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto text-center bg-gradient-to-r from-primary to-primary-container text-on-primary px-8 sm:px-10 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:opacity-90 transition-all active:scale-95"
          >
            Get Started
          </Link>
          <Link
            href="/docs"
            className="w-full sm:w-auto text-center px-8 sm:px-10 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg border border-outline-variant/30 hover:bg-surface-container-low transition-all active:scale-95"
          >
            View Protocol Docs
          </Link>
        </div>
      </div>

      {/* Subtle Light Bleed Effects */}
      <div className="absolute -bottom-24 -left-24 w-48 sm:w-96 h-48 sm:h-96 bg-primary/10 blur-[80px] sm:blur-[120px] rounded-full" />
      <div className="absolute top-24 -right-24 w-48 sm:w-96 h-48 sm:h-96 bg-secondary/5 blur-[80px] sm:blur-[120px] rounded-full" />
    </section>
  );
}
