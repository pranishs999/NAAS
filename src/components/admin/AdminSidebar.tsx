"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  FileCheck,
  Newspaper,
  MessageSquareQuote,
  Users,
  ShieldCheck,
  BarChart3,
  FileText,
  Settings as SettingsIcon,
  LogOut,
  X,
} from "lucide-react";
import { UserRole } from "@/types";

interface AdminSidebarProps {
  userRole: UserRole;
  userName: string;
  onLogout: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function AdminSidebar({
  userRole,
  userName,
  onLogout,
  mobileOpen = false,
  onCloseMobile,
}: AdminSidebarProps): React.JSX.Element {
  const pathname = usePathname();

  const navItems = [
    { label: "Overview", href: "/admin/overview", icon: LayoutDashboard, roles: ["admin", "staff"] },
    { label: "Inquiries", href: "/admin/inquiries", icon: Inbox, roles: ["admin", "staff"] },
    { label: "Services", href: "/admin/services", icon: FileCheck, roles: ["admin"] },
    { label: "News & Updates", href: "/admin/news", icon: Newspaper, roles: ["admin"] },
    { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote, roles: ["admin"] },
    { label: "Users & Roles", href: "/admin/users", icon: Users, roles: ["admin"] },
    { label: "Audit Logs", href: "/admin/audit-logs", icon: ShieldCheck, roles: ["admin"] },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart3, roles: ["admin", "staff"] },
    { label: "Documents", href: "/admin/documents", icon: FileText, roles: ["admin", "staff"] },
    { label: "Settings", href: "/admin/settings", icon: SettingsIcon, roles: ["admin"] },
  ];

  const content = (
    <div className="w-64 h-full bg-[var(--bg-primary)] border-r border-[var(--color-border)] p-4 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-[var(--color-border)]">
          <Link href="/admin/overview" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2A1A0E] text-[#F4AE52] flex items-center justify-center font-black text-sm">
              HBS
            </div>
            <div>
              <span className="font-extrabold text-sm text-[var(--text-primary)] block leading-tight">
                Admin Dashboard
              </span>
              <span className="text-[10px] font-bold text-[#D4621A] uppercase">
                Demo Workspace
              </span>
            </div>
          </Link>
          {onCloseMobile && (
            <button onClick={onCloseMobile} className="lg:hidden p-1 text-[var(--text-secondary)]">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* User Card */}
        <div className="mb-6 p-3 bg-[var(--bg-secondary)] rounded-xl border border-[var(--color-border)] flex items-center justify-between">
          <div className="truncate">
            <span className="font-bold text-xs text-[var(--text-primary)] block truncate">{userName}</span>
            <span className="text-[10px] uppercase font-bold text-[var(--action-orange)] tracking-wider">
              Role: {userRole}
            </span>
          </div>
          <span className="w-2 h-2 rounded-full bg-[var(--color-success)]" title="Active Session" />
        </div>

        {/* Navigation List */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const hasAccess = item.roles.includes(userRole);
            const isActive = pathname === item.href || (item.href !== "/admin/overview" && pathname.startsWith(item.href));
            const Icon = item.icon;

            if (!hasAccess) {
              return null; // Enforce role visibility per permissions matrix
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  isActive
                    ? "bg-[var(--action-orange)] text-white shadow-xs"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Action */}
      <div className="pt-4 border-t border-[var(--color-border)]">
        <button
          onClick={onLogout}
          className="w-full px-3 py-2.5 text-xs font-bold text-[var(--color-error)] hover:bg-[var(--color-error)]/10 rounded-xl flex items-center gap-2 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block h-screen sticky top-0 flex-shrink-0">
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-black/50 backdrop-blur-xs animate-in fade-in">
          {content}
        </div>
      )}
    </>
  );
}
