"use client";

import React from "react";
import Link from "next/link";
import { Menu, Globe, Bell, ShieldAlert } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface AdminHeaderProps {
  onToggleMobile: () => void;
  title?: string;
}

export function AdminHeader({ onToggleMobile, title = "Admin Workspace" }: AdminHeaderProps): React.JSX.Element {
  return (
    <header className="sticky top-0 z-30 bg-[var(--bg-primary)]/90 backdrop-blur-md border-b border-[var(--color-border)] px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobile}
          aria-label="Open sidebar navigation"
          className="lg:hidden p-2 text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-xl border border-[var(--color-border)]"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-base sm:text-lg font-black text-[var(--text-primary)] truncate">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Simulated Notification Indicator */}
        <div className="relative p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg cursor-pointer" title="Simulated In-App Notifications">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F4AE52] animate-pulse" />
        </div>

        <ThemeToggle />

        <Link
          href="/"
          target="_blank"
          className="px-3 py-1.5 text-xs font-semibold border border-[var(--color-border)] hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-xl flex items-center gap-1.5"
        >
          <Globe className="w-3.5 h-3.5 text-[var(--action-orange)]" />
          <span className="hidden sm:inline">View Public Website</span>
        </Link>

        <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-extrabold uppercase bg-[var(--action-orange)]/15 text-[var(--action-orange)] rounded-md">
          <ShieldAlert className="w-3 h-3 text-[var(--action-orange)]" /> Demo
        </span>
      </div>
    </header>
  );
}
