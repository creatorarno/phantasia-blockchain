"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { label: "How it Works", href: "#how-it-works", active: true },
  { label: "Features", href: "#features", active: false },
  
  { label: "Community", href: "#community", active: false },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#131315]/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(124,58,237,0.04)]">
      <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 py-3 sm:py-4 max-w-full mx-auto relative">
        {/* Logo */}
        <Link href="/" className="text-xl sm:text-2xl font-bold tracking-tighter text-primary font-headline hover:text-primary/80 transition-colors">
          CommitChain
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6 lg:gap-10">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={
                link.active
                  ? "text-primary border-b-2 border-primary-container pb-1 font-headline tracking-tight text-sm lg:text-base"
                  : "text-zinc-400 font-medium hover:text-zinc-100 transition-colors font-headline tracking-tight transition-all active:scale-95 duration-200 text-sm lg:text-base"
              }
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Connect Wallet Button — navigates to dashboard */}
        <Link
          href="/dashboard"
          className="hidden md:block bg-gradient-to-br from-primary to-primary-container text-on-primary px-4 lg:px-6 py-2 rounded-lg font-bold text-sm transition-transform active:scale-95 duration-200"
        >
          Connect Wallet
        </Link>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-on-surface p-1"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            )}
          </svg>
        </button>

        {/* Bottom border gradient */}
        <div className="bg-gradient-to-r from-transparent via-surface-container-highest/30 to-transparent h-[1px] w-full absolute bottom-0 left-0" />
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-surface-container-lowest/95 backdrop-blur-xl border-t border-outline-variant/20 px-4 sm:px-6 py-4 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={
                link.active
                  ? "block text-primary font-headline tracking-tight py-1"
                  : "block text-zinc-400 font-medium hover:text-zinc-100 transition-colors font-headline tracking-tight py-1"
              }
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/dashboard"
            className="w-full block bg-gradient-to-br from-primary to-primary-container text-on-primary px-6 py-2.5 rounded-lg font-bold mt-3 text-center"
          >
            Connect Wallet
          </Link>
        </div>
      )}
    </nav>
  );
}
