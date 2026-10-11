"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { X, FileText, Briefcase, PhoneCall, Info, Newspaper, ShieldAlert } from "lucide-react";
import { siteConfig } from "@/config/siteConfig";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps): React.JSX.Element | null {
  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (e: KeyboardEvent): void => {
        if (e.key === "Escape") onClose();
      };
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "unset";
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Drawer"
      className="fixed inset-0 z-50 flex justify-end bg-black/50 animate-in fade-in"
    >
      <div className="w-full max-w-xs h-full bg-[#FEF3E2] p-6 flex flex-col justify-between shadow-xl border-l border-[rgba(42,26,14,0.12)] animate-in slide-in-from-right">
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-[rgba(42,26,14,0.12)]">
            <div>
              <span className="font-extrabold text-base tracking-tight text-[#2A1A0E]">
                {siteConfig.companyName}
              </span>
              <span className="block text-[10px] font-semibold text-[#D4621A]">
                FICTIONAL DEMO
              </span>
            </div>
            <button
              onClick={onClose}
              aria-label="Close navigation menu"
              className="p-2 text-[rgba(42,26,14,0.55)] hover:text-[#2A1A0E] rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="mt-6 flex flex-col gap-2">
            <Link
              href="/"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-xl text-[#2A1A0E] hover:bg-[#FEF3E2]"
            >
              Home
            </Link>
            <Link
              href="/services/visa"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-xl text-[#2A1A0E] hover:bg-[#FEF3E2]"
            >
              <FileText className="w-4 h-4 text-[#D4621A]" />
              Documentation & Visa Services
            </Link>
            <Link
              href="/services/jobs"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-xl text-[#2A1A0E] hover:bg-[#FEF3E2]"
            >
              <Briefcase className="w-4 h-4 text-[#F4AE52]" />
              International Job Services
            </Link>
            <Link
              href="/about"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-xl text-[#2A1A0E] hover:bg-[#FEF3E2]"
            >
              <Info className="w-4 h-4 text-[rgba(42,26,14,0.55)]" />
              About Us
            </Link>
            <Link
              href="/contact"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-xl text-[#2A1A0E] hover:bg-[#FEF3E2]"
            >
              <PhoneCall className="w-4 h-4 text-[rgba(42,26,14,0.55)]" />
              Contact Us
            </Link>
            <Link
              href="/news"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-xl text-[#2A1A0E] hover:bg-[#FEF3E2]"
            >
              <Newspaper className="w-4 h-4 text-[rgba(42,26,14,0.55)]" />
              News & Updates
            </Link>
          </nav>
        </div>

        <div className="pt-6 border-t border-[rgba(42,26,14,0.12)]">
          <Link
            href="/admin/login"
            onClick={onClose}
            className="w-full py-2.5 text-center text-xs font-bold text-white bg-[#2A1A0E] rounded-xl hover:bg-[#D4621A] flex items-center justify-center gap-2"
          >
            <ShieldAlert className="w-4 h-4 text-[#F4AE52]" />
            Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
}
