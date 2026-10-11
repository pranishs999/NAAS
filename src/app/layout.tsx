import type { Metadata } from "next";
import { Suspense } from "react";
import "@/app/globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { PublicChrome } from "@/components/layout/PublicChrome";
import { siteConfig } from "@/config/siteConfig";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.companyName} | UAE Visa, Documentation & International Jobs`,
    template: `%s | ${siteConfig.companyName}`,
  },
  description:
    "Official website for Horizon Business Services offering residency visas, document attestation, family visas, and international job placement assistance in Dubai, UAE.",
  keywords: [
    "UAE Visa Services",
    "Dubai Document Attestation",
    "Golden Visa UAE",
    "International Job Assistance",
    "Horizon Business Services",
  ],
  authors: [{ name: siteConfig.companyName }],
  openGraph: {
    title: siteConfig.companyName,
    description: "Documentation & Visa Services and International Job Placement Assistance in Dubai, UAE.",
    url: "http://localhost:3000",
    siteName: siteConfig.companyName,
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] antialiased selection:bg-[var(--accent-gold)] selection:text-black">
        <Navbar />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Suspense fallback={null}>
          <PublicChrome />
        </Suspense>
      </body>
    </html>
  );
}
