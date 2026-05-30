import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { ValueProposition } from "@/components/landing/ValueProposition";
import { AIFeatureShowcase } from "@/components/landing/AIFeatureShowcase";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";
import { GitHubLoginModal } from "@/components/GitHubLoginModal";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-on-surface overflow-hidden relative">
      <Navbar />
      <main>
        <HeroSection />
        <AIFeatureShowcase />
        <ValueProposition />
        <CTASection />
      </main>
      <Footer />
      <GitHubLoginModal />
    </div>
  );
}
