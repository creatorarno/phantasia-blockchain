import { Fingerprint, Brain, Database, LucideIcon } from "lucide-react";

type CardType = {
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
  tag: string;
  variant: "default" | "featured";
  badge?: string;
};

const cards: CardType[] = [
  {
    icon: Fingerprint,
    iconColor: "text-primary",
    iconBg: "bg-surface-container-highest",
    title: "Verifiable Reputation",
    description:
      "Sovereign identity built on code quality, not just quantity. Transform your GitHub history into an immutable career asset.",
    tag: "ID: CC-REP-7721",
    variant: "default" as const,
  },
  {
    icon: Brain,
    iconColor: "text-white",
    iconBg: "bg-surface-container-highest",
    title: "AI-Driven Insights",
    description:
      "Automated analysis of impact, security, and complexity for every contribution. Our LLM-vetted proofs ensure meritocracy.",
    tag: "Engine: Neural-Trace v4",
    variant: "featured" as const,

  },
  {
    icon: Database,
    iconColor: "text-secondary",
    iconBg: "bg-surface-container-highest",
    title: "Permanently On-Chain",
    description:
      "Records stored on IPFS and anchored to Polygon for immutable proof. Your impact persists even if centralized hubs vanish.",
    tag: "Protocol: IPFS-Pin-v2",
    variant: "default" as const,
  },
];

export function ValueProposition() {
  return (
    <section id="features" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 sm:mb-16 gap-4 sm:gap-6">
        <div className="max-w-2xl">
          <span className="font-mono text-primary text-xs sm:text-sm tracking-[0.3em] uppercase">
            Core Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3 sm:mt-4 tracking-tight">
            Beyond the Commit History
          </h2>
        </div>
        <div className="h-px flex-1 bg-surface-container-high mx-8 hidden md:block" />
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className={
              card.variant === "featured"
                ? "group bg-gradient-to-br from-primary/20 to-transparent p-[1px] rounded-2xl transition-all duration-500 hover:scale-[1.02] sm:col-span-2 lg:col-span-1"
                : "group bg-surface-container-low p-1 rounded-2xl relative overflow-hidden transition-all duration-500 hover:scale-[1.02]"
            }
          >
            <div
              className={`bg-surface-container-low h-full p-6 sm:p-8 rounded-2xl relative overflow-hidden ${
                card.variant === "default" ? "border border-outline-variant/10" : ""
              }`}
            >
              {/* Featured badge */}
              {card.badge && (
                <div className="absolute top-0 right-0 p-3 sm:p-4">
                  <span className="text-[8px] font-mono text-secondary tracking-widest px-2 py-1 rounded border border-secondary/20 uppercase">
                    {card.badge}
                  </span>
                </div>
              )}

              {/* Icon */}
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg ${card.iconBg} mb-5 sm:mb-8 overflow-hidden flex-shrink-0`}
              >
                <card.icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>

              {/* Content */}
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">{card.title}</h3>
              <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed mb-6 sm:mb-8">
                {card.description}
              </p>

              {/* Tag */}
              <div className="font-mono text-[10px] text-primary/40 mt-auto uppercase tracking-tighter">
                {card.tag}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
