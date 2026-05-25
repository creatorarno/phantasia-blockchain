"use client";

import { useAuth } from "@/components/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

// ─── GitHub SVG Icon ────────────────────────────────────────────
function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

// ─── Backdrop ───────────────────────────────────────────────────
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring" as const, damping: 25, stiffness: 300 },
  },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } },
};

// ═══════════════════════════════════════════════════════════════
//  LOGIN MODAL
// ═══════════════════════════════════════════════════════════════
export function GitHubLoginModal() {
  const { showLoginModal, closeLoginModal, loginWithGitHub } = useAuth();

  return (
    <AnimatePresence>
      {showLoginModal && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeLoginModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-md rounded-2xl overflow-hidden"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Gradient border effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary/10 to-primary-container/20 rounded-2xl" />

            <div className="relative m-[1px] rounded-2xl bg-[#131315]/95 backdrop-blur-2xl">
              {/* Close button */}
              <button
                onClick={closeLoginModal}
                className="absolute top-4 right-4 p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest/50 rounded-lg transition-all z-10"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-primary/15 blur-[80px] pointer-events-none" />

              {/* Content */}
              <div className="relative px-8 pt-12 pb-10">
                {/* Logo & Title */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-surface-container-high to-surface-container-lowest border border-outline-variant/20 mb-6 shadow-2xl">
                    <GitHubIcon className="w-10 h-10 text-on-surface" />
                  </div>
                  <h2 className="text-2xl font-bold font-headline tracking-tight text-on-surface mb-2">
                    Welcome to CommitChain
                  </h2>
                  <p className="text-sm text-on-surface-variant leading-relaxed max-w-xs mx-auto">
                    Sign in with your GitHub account to track and verify your open-source contributions on-chain.
                  </p>
                </div>

                {/* Sign in with GitHub button */}
                <button
                  onClick={() => {
                    loginWithGitHub();
                  }}
                  className="w-full flex items-center justify-center gap-3 bg-white text-[#131315] font-bold py-3.5 px-6 rounded-xl hover:bg-zinc-100 transition-all active:scale-[0.98] shadow-lg shadow-white/5 text-base"
                >
                  <GitHubIcon className="w-5 h-5" />
                  Continue with GitHub
                </button>

                {/* Divider */}
                <div className="flex items-center gap-4 my-6">
                  <div className="flex-1 h-px bg-outline-variant/20" />
                  <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-widest">
                    Secure OAuth
                  </span>
                  <div className="flex-1 h-px bg-outline-variant/20" />
                </div>

                {/* Features list */}
                <div className="space-y-3">
                  {[
                    {
                      icon: "🔒",
                      label: "We never store your password",
                    },
                    {
                      icon: "📊",
                      label: "Access your public repositories & contributions",
                    },
                    {
                      icon: "⛓️",
                      label: "Build verifiable on-chain reputation",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-surface-container-lowest/50"
                    >
                      <span className="text-base flex-shrink-0">
                        {item.icon}
                      </span>
                      <span className="text-xs text-on-surface-variant">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer note */}
                <p className="text-[10px] text-center text-on-surface-variant/60 mt-6 leading-relaxed">
                  By continuing, you agree to CommitChain&apos;s Terms of Service
                  and Privacy Policy.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
