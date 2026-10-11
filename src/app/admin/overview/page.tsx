"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Inbox,
  Clock,
  CheckCircle2,
  FileCheck,
  Briefcase,
  TrendingUp,
  ArrowUpRight,
  UserCheck,
} from "lucide-react";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getInquiries, getUsers } from "@/lib/data/demoStore";
import { Inquiry, UserRole } from "@/types";

export default function AdminOverviewPage(): React.JSX.Element {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [userRole, setUserRole] = useState<UserRole>("admin");
  const [userName, setUserName] = useState("System Admin (Demo)");

  useEffect(() => {
    setInquiries(getInquiries());
    // Fetch active session info
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUserRole(data.user.role);
          setUserName(data.user.name);
        }
      })
      .catch(() => {});
  }, []);

  const total = inquiries.length;
  const newInquiries = inquiries.filter((i) => i.status === "new").length;
  const inReview = inquiries.filter((i) => i.status === "in_review" || i.status === "processing").length;
  const completed = inquiries.filter((i) => i.status === "completed").length;

  const visaCount = inquiries.filter((i) => i.branch === "visa").length;
  const jobCount = inquiries.filter((i) => i.branch === "jobs").length;

  const handleLogout = async (): Promise<void> => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  return (
    <div className="min-h-screen flex bg-[var(--bg-secondary)]">
      <AdminSidebar
        userRole={userRole}
        userName={userName}
        onLogout={handleLogout}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onToggleMobile={() => setMobileOpen(true)} title="Dashboard Overview" />

        <main className="p-4 sm:p-6 lg:p-8 space-y-8 flex-1">
          {/* Top Metric Cards (Q70) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-2xl shadow-xs space-y-2">
              <div className="flex items-center justify-between text-[var(--text-secondary)]">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Inquiries</span>
                <Inbox className="w-5 h-5 text-[var(--accent-gold)]" />
              </div>
              <div className="text-3xl font-black text-[var(--text-primary)]">{total}</div>
              <span className="text-[11px] text-[#2A1A0E] font-semibold inline-flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Live Demo Records
              </span>
            </div>

            <div className="p-6 bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-2xl shadow-xs space-y-2">
              <div className="flex items-center justify-between text-[var(--text-secondary)]">
                <span className="text-xs font-semibold uppercase tracking-wider">New Triage Queue</span>
                <Clock className="w-5 h-5 text-[var(--action-orange)]" />
              </div>
              <div className="text-3xl font-black text-[var(--action-orange)]">{newInquiries}</div>
              <span className="text-[11px] text-[var(--text-secondary)] font-medium">Awaiting Initial Action</span>
            </div>

            <div className="p-6 bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-2xl shadow-xs space-y-2">
              <div className="flex items-center justify-between text-[var(--text-secondary)]">
                <span className="text-xs font-semibold uppercase tracking-wider">In Progress</span>
                <UserCheck className="w-5 h-5 text-[var(--accent-amber)]" />
              </div>
              <div className="text-3xl font-black text-[var(--accent-amber)]">{inReview}</div>
              <span className="text-[11px] text-[var(--text-secondary)] font-medium">Under Review or Processing</span>
            </div>

            <div className="p-6 bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-2xl shadow-xs space-y-2">
              <div className="flex items-center justify-between text-[var(--text-secondary)]">
                <span className="text-xs font-semibold uppercase tracking-wider">Completed</span>
                <CheckCircle2 className="w-5 h-5 text-[var(--color-success)]" />
              </div>
              <div className="text-3xl font-black text-[var(--color-success)]">{completed}</div>
              <span className="text-[11px] text-[var(--color-success)] font-semibold">
                {total > 0 ? ((completed / total) * 100).toFixed(0) : 0}% Conversion Rate
              </span>
            </div>
          </div>

          {/* Branch Breakdown Comparison Cards (Q70) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-2xl shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[var(--accent-amber)]/15 text-[var(--action-orange)]">
                    <FileCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[var(--text-primary)]">Documentation & Visa</h3>
                    <span className="text-xs text-[var(--text-secondary)]">Branch 01 Volume</span>
                  </div>
                </div>
                <span className="text-2xl font-black text-[var(--text-primary)]">{visaCount}</span>
              </div>
              <div className="w-full bg-[var(--bg-secondary)] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[var(--accent-amber)] h-full"
                  style={{ width: `${total > 0 ? (visaCount / total) * 100 : 0}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                <span>{total > 0 ? ((visaCount / total) * 100).toFixed(1) : 0}% of Total Volume</span>
                <Link href="/admin/inquiries?branch=visa" className="font-bold text-[var(--action-orange)] hover:underline">
                  Filter Visa Inquiries →
                </Link>
              </div>
            </div>

            <div className="p-6 bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-2xl shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[var(--action-orange)]/15 text-[var(--action-orange)]">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[var(--text-primary)]">International Jobs</h3>
                    <span className="text-xs text-[var(--text-secondary)]">Branch 02 Volume</span>
                  </div>
                </div>
                <span className="text-2xl font-black text-[var(--text-primary)]">{jobCount}</span>
              </div>
              <div className="w-full bg-[var(--bg-secondary)] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[var(--action-orange)] h-full"
                  style={{ width: `${total > 0 ? (jobCount / total) * 100 : 0}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                <span>{total > 0 ? ((jobCount / total) * 100).toFixed(1) : 0}% of Total Volume</span>
                <Link href="/admin/inquiries?branch=jobs" className="font-bold text-[var(--action-orange)] hover:underline">
                  Filter Job Inquiries →
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Inquiries Quick Table */}
          <div className="p-6 bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-2xl shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[var(--text-primary)]">Recent Inquiries</h3>
                <span className="text-xs text-[var(--text-secondary)]">Latest visitor submissions</span>
              </div>
              <Link
                href="/admin/inquiries"
                className="text-xs font-bold text-[var(--action-orange)] hover:underline inline-flex items-center gap-1"
              >
                View All Inquiries <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[var(--color-border)] text-[var(--text-secondary)] uppercase tracking-wider">
                    <th className="py-3 px-3">Reference Code</th>
                    <th className="py-3 px-3">Full Name</th>
                    <th className="py-3 px-3">Branch</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Submitted</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)] text-[var(--text-primary)]">
                  {inquiries.slice(0, 5).map((inq) => (
                    <tr key={inq.id} className="hover:bg-[var(--bg-secondary)]/50 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-[var(--action-orange)]">
                        {inq.referenceCode}
                      </td>
                      <td className="py-3 px-3 font-medium">{inq.fullName}</td>
                      <td className="py-3 px-3 capitalize">{inq.branch}</td>
                      <td className="py-3 px-3">
                        <StatusBadge status={inq.status} />
                      </td>
                      <td className="py-3 px-3 text-[var(--text-secondary)]">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Link
                          href={`/admin/inquiries/${inq.id}`}
                          className="px-2.5 py-1 text-[11px] font-bold border border-[var(--color-border)] rounded-lg hover:bg-[var(--bg-secondary)]"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
