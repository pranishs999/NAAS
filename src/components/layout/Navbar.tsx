"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, Shield, FileCheck, Briefcase } from "lucide-react";
import { MobileDrawer } from "./MobileDrawer";
import { siteConfig } from "@/config/siteConfig";

export function Navbar(): React.JSX.Element {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Skip to Content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#D4621A] focus:text-white focus:font-bold focus:rounded-lg"
      >
        Skip to main content
      </a>

      {/* Top Demo Notification Ribbon */}
      <div className="bg-[#FEF3E2] border-b border-[rgba(42,26,14,0.12)] py-1.5 px-4 text-center text-xs font-medium text-[#2A1A0E] flex items-center justify-center gap-2">
        <span className="px-1.5 py-0.5 rounded bg-[#D4621A]/15 text-[10px] font-bold uppercase tracking-wider text-[#D4621A]">
          Fictional Demo
        </span>
        <span>Evaluation build for Horizon Business Services. All data is fictional.</span>
      </div>

      <header className="sticky top-0 z-40 bg-[#FEF3E2]/95 backdrop-blur-md border-b border-[rgba(42,26,14,0.12)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-3 rounded-lg p-1">
            <div className="w-10 h-10 rounded-xl bg-[#2A1A0E] text-[#F4AE52] flex items-center justify-center font-black text-xl shadow-xs">
              HBS
            </div>
            <div>
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-[#2A1A0E] block leading-tight">
                {siteConfig.companyName}
              </span>
              <span className="text-[11px] font-medium text-[rgba(42,26,14,0.55)] block">
                Dubai, UAE & International
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6" aria-label="Main Navigation">
            <Link
              href="/"
              className="text-sm font-medium text-[#2A1A0E] hover:text-[#D4621A] transition-colors"
            >
              Home
            </Link>

            {/* Branch 1 */}
            <Link
              href="/services/visa"
              className="flex items-center gap-1.5 text-sm font-semibold text-[#2A1A0E] hover:text-[#D4621A] transition-colors"
            >
              <FileCheck className="w-4 h-4 text-[#D4621A]" />
              <span>Documentation & Visa</span>
            </Link>

            {/* Branch 2 */}
            <Link
              href="/services/jobs"
              className="flex items-center gap-1.5 text-sm font-semibold text-[#2A1A0E] hover:text-[#D4621A] transition-colors"
            >
              <Briefcase className="w-4 h-4 text-[#F4AE52]" />
              <span>International Jobs</span>
            </Link>

            <Link
              href="/about"
              className="text-sm font-medium text-[#2A1A0E] hover:text-[#D4621A] transition-colors"
            >
              About Us
            </Link>

            <Link
              href="/news"
              className="text-sm font-medium text-[#2A1A0E] hover:text-[#D4621A] transition-colors"
            >
              News & Updates
            </Link>

            <Link
              href="/contact"
              className="text-sm font-medium text-[#2A1A0E] hover:text-[#D4621A] transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Right Action Items */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/admin/login"
              className="px-4 py-2 text-xs font-bold text-white bg-[#2A1A0E] hover:bg-[#D4621A] rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5 text-[#F4AE52]" />
              Admin Portal
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileOpen(true)}
              aria-expanded={mobileOpen}
              aria-label="Open navigation menu"
              className="p-2.5 text-[#2A1A0E] hover:bg-[#FEF3E2] rounded-xl border border-[rgba(42,26,14,0.12)]"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <MobileDrawer isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
