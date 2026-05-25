import type { Metadata } from "next";
import { AuthProvider } from "@/components/AuthContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "CommitChain | The Sovereign Proof of Contribution",
  description:
    "Track, verify, and monetize your open-source impact with AI-powered analysis on Polygon. Build verifiable on-chain reputation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-on-surface selection:bg-primary-container selection:text-on-primary-container min-h-screen antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
