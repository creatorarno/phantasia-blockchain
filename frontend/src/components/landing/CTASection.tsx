import Link from "next/link";

export function CTASection() {
  return (
    <section id="community" className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto glass-card rounded-2xl sm:rounded-3xl p-8 sm:p-12 md:p-16 lg:p-24 text-center relative overflow-hidden border border-outline-variant/10">
        {/* Radial glow background */}
        <div
          className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 50%, #7c3aed 0%, transparent 70%)",
          }}
        />

        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6 lg:mb-8 relative z-10 leading-tight">
          Start Building Your <br className="hidden sm:block" /> Cryptographic Legacy.
        </h2>
        <p className="text-base sm:text-lg lg:text-xl text-on-surface-variant mb-8 sm:mb-10 lg:mb-12 max-w-2xl mx-auto relative z-10">
          Join thousands of developers turning their open-source contributions
          into on-chain sovereign reputation.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 lg:gap-6 relative z-10">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto text-center bg-white text-background px-8 sm:px-10 lg:px-12 py-3.5 sm:py-4 lg:py-5 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg lg:text-xl hover:scale-105 transition-transform"
          >
            Get Started Now
          </Link>
          <a
            href="https://discord.gg/commitchain"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto text-center text-on-surface px-8 sm:px-10 lg:px-12 py-3.5 sm:py-4 lg:py-5 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg lg:text-xl border border-outline-variant/30 hover:bg-white/5 transition-all"
          >
            Join Discord
          </a>
        </div>
      </div>
    </section>
  );
}
