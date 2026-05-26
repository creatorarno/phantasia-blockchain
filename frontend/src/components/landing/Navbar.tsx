"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import { LogOut, LayoutDashboard, ChevronDown } from "lucide-react";

const navLinks = [
  { label: "How it Works", href: "#how-it-works", active: true },
  { label: "Features", href: "#features", active: false },
  { label: "Community", href: "#community", active: false },
  { label: "Docs", href: "/docs", active: false },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, isAuthenticated, openLoginModal, logout } = useAuth();

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#131315]/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(124,58,237,0.04)]">
      <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 py-3 sm:py-4 max-w-full mx-auto relative">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl sm:text-2xl font-bold tracking-tighter text-primary font-headline hover:text-primary/80 transition-colors"
        >
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

        {/* Right side: Auth button */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 bg-surface-container-low border border-outline-variant/15 rounded-lg hover:bg-surface-container-highest transition-all"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={user.avatar_url}
                  alt={user.login}
                  className="w-7 h-7 rounded-full border border-outline-variant/20"
                />
                <span className="text-sm font-medium text-on-surface max-w-[120px] truncate">
                  {user.login}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-on-surface-variant transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-52 bg-[#1b1b1d]/95 backdrop-blur-xl border border-outline-variant/20 rounded-xl shadow-2xl z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-outline-variant/10">
                      <p className="text-sm font-medium text-on-surface truncate">
                        {user.name || user.login}
                      </p>
                      <p className="text-xs text-on-surface-variant truncate">
                        @{user.login}
                      </p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest/50 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setDropdownOpen(false);
                        }}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={openLoginModal}
              className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-4 lg:px-6 py-2 rounded-lg font-bold text-sm transition-transform active:scale-95 duration-200"
            >
              Login
            </button>
          )}
        </div>

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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
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

          {isAuthenticated && user ? (
            <div className="space-y-2 pt-2 border-t border-outline-variant/20">
              <div className="flex items-center gap-3 py-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={user.avatar_url}
                  alt={user.login}
                  className="w-8 h-8 rounded-full border border-outline-variant/20"
                />
                <div>
                  <p className="text-sm font-medium text-on-surface">
                    {user.name || user.login}
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    @{user.login}
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="w-full block bg-gradient-to-br from-primary to-primary-container text-on-primary px-6 py-2.5 rounded-lg font-bold text-center"
              >
                Go to Dashboard
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="w-full block text-red-400 px-6 py-2.5 rounded-lg font-medium text-center border border-red-500/20 hover:bg-red-500/5 transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                openLoginModal();
                setMobileOpen(false);
              }}
              className="w-full block bg-gradient-to-br from-primary to-primary-container text-on-primary px-6 py-2.5 rounded-lg font-bold mt-3 text-center"
            >
              Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
