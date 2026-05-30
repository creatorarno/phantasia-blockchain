/* eslint-disable @next/next/no-img-element */

const checkItems = [
  {
    title: "Complexity Score Analysis",
    description: "Identifying non-trivial logic and architectural patterns.",
  },
  {
    title: "Security Weighting",
    description: "Rewarding security-first patches and robust error handling.",
  },
];

const progressBars = [
  {
    label: "Architecture Impact",
    value: 88,
    color: "bg-primary",
    textColor: "text-primary",
    glow: "",
  },
  {
    label: "Refactoring Cleanliness",
    value: 92,
    color: "bg-secondary",
    textColor: "text-secondary",
    glow: "",
  },
];

export function AIFeatureShowcase() {
  return (
    <section id="how-it-works" className="py-16 sm:py-20 lg:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <div>
            <span className="font-mono text-secondary text-xs sm:text-sm tracking-[0.3em] uppercase">
              Deep Dive
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3 sm:mt-4 mb-5 sm:mb-8 tracking-tight leading-tight">
              Quantifying Logic with Precision
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-on-surface-variant leading-relaxed mb-8 sm:mb-10">
              Our AI analysis doesn&apos;t just count lines of code. It evaluates
              architectural significance, algorithmic complexity, and documentation
              clarity to give you a true &apos;Impact Score&apos;.
            </p>
            <div className="space-y-4 sm:space-y-6">
              {checkItems.map((item) => (
                <div key={item.title} className="flex items-start gap-3 sm:gap-4">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-secondary/10 flex items-center justify-center mt-0.5 sm:mt-1 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-secondary"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface text-sm sm:text-base">{item.title}</h4>
                    <p className="text-on-surface-variant text-xs sm:text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Dashboard Mockup */}
          <div className="relative">
            <div className="relative bg-surface-container-lowest border border-outline-variant/30 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl">
              {/* Dashboard Header */}
              <div className="bg-surface-container-high/50 px-3 sm:px-4 py-2.5 sm:py-4 border-b border-outline-variant/30 flex justify-between items-center">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500/50" />
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500/50" />
                  <span className="ml-2 sm:ml-4 font-mono text-[8px] sm:text-[10px] text-on-surface-variant opacity-60 hidden sm:inline">
                    ANALYSIS_LOGS // PR-1042
                  </span>
                </div>
                <div className="font-mono text-[8px] sm:text-[10px] text-secondary">
                  READY TO ANCHOR
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-4 sm:p-6 lg:p-8">
                {/* Score Header */}
                <div className="flex items-center justify-between mb-5 sm:mb-8">
                  <div>
                    <h4 className="text-[10px] sm:text-xs font-mono text-on-surface-variant uppercase tracking-widest mb-1">
                      Impact Score
                    </h4>
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary tracking-tighter">
                      94.8{" "}
                      <span className="text-[10px] sm:text-sm font-normal text-on-surface-variant">
                        / 100
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <h4 className="text-[10px] sm:text-xs font-mono text-on-surface-variant uppercase tracking-widest mb-1">
                      Complexity
                    </h4>
                    <div className="text-sm sm:text-lg font-bold text-on-surface">EXTREME</div>
                  </div>
                </div>

                {/* Progress Bars */}
                <div className="space-y-3 sm:space-y-6">
                  {progressBars.map((bar) => (
                    <div
                      key={bar.label}
                      className="p-3 sm:p-4 rounded-lg bg-surface-container border border-outline-variant/10"
                    >
                      <div className="flex justify-between text-[10px] sm:text-xs font-mono mb-2">
                        <span className="text-on-surface-variant">{bar.label}</span>
                        <span className={bar.textColor}>{bar.value}%</span>
                      </div>
                      <div className="h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
                        <div
                          className={`h-full ${bar.color} ${bar.glow}`}
                          style={{ width: `${bar.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* User Footer */}
                <div className="mt-5 sm:mt-8 pt-4 sm:pt-6 border-t border-outline-variant/10">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <img
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-primary/30 flex-shrink-0"
                      alt="Developer avatar"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuArIj43Y5yLPBV2J4wivobGMhOt75pTX5MY19nBn5l8TLPaM0rYCmuWhwlmOiqWSydd6FLAEir8VUyGvKGdI3xbG5cN6ghy7MQn_qlEzPLOeV-cmcO4s0EMbx8TAOc8ltaWn3HzznF07re8tGXpkb62G4mVxHSCJGl5cetU9pZ4yGjdwAOX1hjjsMp62zmZAgfoN73reioeNTxN202OGqklLdME-PNKyx1V-5NZ9UxH-NoRGm573ldd8RMUQgX14ByrjT7S4lX0HhQ"
                    />
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-bold truncate">cryptopioneer.eth</div>
                      <div className="text-[9px] sm:text-[10px] font-mono text-on-surface-variant">
                        ID: 0x71...f9a2
                      </div>
                    </div>
                    <button className="ml-auto text-[10px] sm:text-xs bg-primary/10 text-primary border border-primary/20 px-2 sm:px-3 py-1 rounded whitespace-nowrap flex-shrink-0">
                      Verify Hash
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
