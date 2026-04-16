import Link from "next/link";

const footerLinks = [
  { label: "Protocol", href: "/dashboard", external: false },
  { label: "Docs", href: "/docs", external: false },
  { label: "Terms", href: "#", external: false },
  { label: "Privacy", href: "#", external: false },
  { label: "Twitter", href: "https://twitter.com/commitchain", external: true },
  { label: "Discord", href: "https://discord.gg/commitchain", external: true },
];

export function Footer() {
  return (
    <footer className="w-full py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="bg-zinc-800/50 h-[1px] w-full mb-6 sm:mb-8" />
      <div className="max-w-7xl mx-auto flex flex-col gap-6 sm:gap-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-2 sm:gap-4">
            <Link href="/" className="font-headline font-bold text-zinc-100 text-lg sm:text-xl tracking-tighter hover:text-primary transition-colors">
              CommitChain
            </Link>
            <p className="text-zinc-500 font-body text-xs sm:text-sm tracking-wide text-center md:text-left">
              © 2024 CommitChain. Built for the Cryptographic Atelier.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 sm:gap-x-8 sm:gap-y-3">
            {footerLinks.map((link) =>
              link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-500 hover:text-zinc-100 transition-colors font-body text-xs sm:text-sm tracking-wide"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-zinc-500 hover:text-zinc-100 transition-colors font-body text-xs sm:text-sm tracking-wide"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
