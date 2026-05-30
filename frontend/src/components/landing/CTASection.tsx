"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthContext";

export function CTASection() {
  const { isAuthenticated, openLoginModal } = useAuth();

  return (
    <section
      id="community"
      className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-5xl mx-auto glass-card rounded-2xl sm:rounded-3xl p-8 sm:p-12 md:p-16 lg:p-24 text-center relative overflow-hidden border border-outline-variant/10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6 lg:mb-8 leading-tight">
          Start <span className="text-primary">Building Your</span> <br className="hidden sm:block" /> <span className="text-primary">Cryptographic</span>
          {" "} Legacy.
        </h2>
        <p className="text-base sm:text-lg lg:text-xl text-on-surface-variant mb-8 sm:mb-10 lg:mb-12 max-w-2xl mx-auto">
          Join thousands of developers turning their open-source contributions
          into on-chain sovereign reputation.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 lg:gap-6">
          {isAuthenticated ? (
            <Link
              href="/dashboard"
              className="w-full sm:w-auto text-center bg-white text-background px-8 sm:px-10 lg:px-12 py-3.5 sm:py-4 lg:py-5 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg lg:text-xl hover:scale-105 transition-transform"
            >
              Go to Dashboard
            </Link>
          ) : (
            <button
              onClick={openLoginModal}
              className="w-full sm:w-auto text-center bg-white text-background px-8 sm:px-10 lg:px-12 py-3.5 sm:py-4 lg:py-5 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg lg:text-xl hover:scale-105 transition-transform"
            >
              Get Started Now
            </button>
          )}
          <a
            href="https://github.com/creatorarno/phantasia-blockchain"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto text-center text-on-surface px-8 sm:px-10 lg:px-12 py-3.5 sm:py-4 lg:py-5 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg lg:text-xl border border-outline-variant/30 hover:bg-white/5 transition-all"
          >
            Contribute to Github
          </a>
        </div>
      </div>
    </section>
  );
}
