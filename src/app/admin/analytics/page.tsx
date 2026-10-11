"use client";

import React, { useState, useEffect } from "react";
import { Download, Printer, BarChart3, TrendingUp, PieChart, FileCheck, Briefcase } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { getInquiries, exportAnalyticsCsv } from "@/lib/data/demoStore";
import { Inquiry, UserRole } from "@/types";

export default function AdminAnalyticsPage(): React.JSX.Element {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [userRole, setUserRole] = useState<UserRole>("admin");
  const [userName, setUserName] = useState("System Admin (Demo)");

  useEffect(() => {
    setInquiries(getInquiries());
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
  const visa = inquiries.filter((i) => i.branch === "visa").length;
  const jobs = inquiries.filter((i) => i.branch === "jobs").length;
  const completed = inquiries.filter((i) => i.status === "completed").length;

  const handleExportCsv = (): void => {
    const csv = exportAnalyticsCsv();
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.setAttribute("download", `HBS_Analytics_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrint = (): void => {
    window.print();
  };

  const handleLogout = async (): Promise<void> => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  return (
    <div className="min-h-screen flex bg-[#FEF3E2]">
      <AdminSidebar
        userRole={userRole}
        userName={userName}
        onLogout={handleLogout}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onToggleMobile={() => setMobileOpen(true)} title="Analytics & Reports" />

        <main className="p-4 sm:p-6 lg:p-8 space-y-8 flex-1 print:p-0 print:bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#2A1A0E]">Analytics & Performance Metrics</h2>
              <p className="text-xs text-[rgba(42,26,14,0.55)]">Volume trends, conversion funnel, and branch comparisons.</p>
            </div>
            <div className="flex items-center gap-2 print:hidden">
              <button
                onClick={handlePrint}
                className="px-3.5 py-2 border border-[rgba(42,26,14,0.12)] bg-white text-[#2A1A0E] text-xs font-semibold rounded-xl hover:bg-[#FEF3E2] flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-4 h-4 text-[#D4621A]" /> Printable Summary
              </button>
              <button
                onClick={handleExportCsv}
                className="px-4 py-2 bg-[#D4621A] text-white text-xs font-bold rounded-xl hover:bg-[#D4621A] flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Download className="w-4 h-4 text-white" /> Export CSV
              </button>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white border border-[rgba(42,26,14,0.12)] rounded-2xl shadow-xs space-y-2">
              <span className="text-xs font-semibold uppercase text-[rgba(42,26,14,0.55)]">Total Inquiries Logged</span>
              <div className="text-3xl font-black text-[#2A1A0E]">{total}</div>
              <span className="text-[11px] text-[#2A1A0E] font-semibold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Demo Dataset
              </span>
            </div>

            <div className="p-6 bg-white border border-[rgba(42,26,14,0.12)] rounded-2xl shadow-xs space-y-2">
              <span className="text-xs font-semibold uppercase text-[rgba(42,26,14,0.55)]">Visa & Documentation</span>
              <div className="text-3xl font-black text-[#D4621A]">{visa}</div>
              <span className="text-[11px] text-[rgba(42,26,14,0.55)]">
                {total > 0 ? ((visa / total) * 100).toFixed(1) : 0}% Share
              </span>
            </div>

            <div className="p-6 bg-white border border-[rgba(42,26,14,0.12)] rounded-2xl shadow-xs space-y-2">
              <span className="text-xs font-semibold uppercase text-[rgba(42,26,14,0.55)]">International Jobs</span>
              <div className="text-3xl font-black text-[#2A1A0E]">{jobs}</div>
              <span className="text-[11px] text-[rgba(42,26,14,0.55)]">
                {total > 0 ? ((jobs / total) * 100).toFixed(1) : 0}% Share
              </span>
            </div>

            <div className="p-6 bg-white border border-[rgba(42,26,14,0.12)] rounded-2xl shadow-xs space-y-2">
              <span className="text-xs font-semibold uppercase text-[rgba(42,26,14,0.55)]">Completed Conversions</span>
              <div className="text-3xl font-black text-[#2A1A0E]">{completed}</div>
              <span className="text-[11px] text-[#2A1A0E] font-bold">
                {total > 0 ? ((completed / total) * 100).toFixed(1) : 0}% Success Rate
              </span>
            </div>
          </div>

          {/* Visual Distribution Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-white border border-[rgba(42,26,14,0.12)] rounded-2xl shadow-xs space-y-4">
              <h3 className="text-base font-bold text-[#2A1A0E] flex items-center gap-2">
                <PieChart className="w-5 h-5 text-[#D4621A]" /> Branch Distribution Ratio
              </h3>

              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1 text-[#2A1A0E]">
                    <span className="flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4 text-[#D4621A]" /> Documentation & Visa
                    </span>
                    <span>{visa} ({total > 0 ? ((visa / total) * 100).toFixed(0) : 0}%)</span>
                  </div>
                  <div className="w-full bg-[#FEF3E2] h-3 rounded-full overflow-hidden border border-[rgba(42,26,14,0.12)]">
                    <div className="bg-[#D4621A] h-full" style={{ width: `${total > 0 ? (visa / total) * 100 : 0}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1 text-[#2A1A0E]">
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-[#F4AE52]" /> International Jobs
                    </span>
                    <span>{jobs} ({total > 0 ? ((jobs / total) * 100).toFixed(0) : 0}%)</span>
                  </div>
                  <div className="w-full bg-[#FEF3E2] h-3 rounded-full overflow-hidden border border-[rgba(42,26,14,0.12)]">
                    <div className="bg-[#F4AE52] h-full" style={{ width: `${total > 0 ? (jobs / total) * 100 : 0}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white border border-[rgba(42,26,14,0.12)] rounded-2xl shadow-xs space-y-4">
              <h3 className="text-base font-bold text-[#2A1A0E] flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#D4621A]" /> Status Pipeline Triage
              </h3>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-[#FEF3E2] rounded-xl border border-[rgba(42,26,14,0.12)]">
                  <span className="text-[rgba(42,26,14,0.55)] block">New Inquiries</span>
                  <span className="text-lg font-bold text-[#2A1A0E]">{inquiries.filter((i) => i.status === "new").length}</span>
                </div>
                <div className="p-3 bg-[#FEF3E2] rounded-xl border border-[rgba(42,26,14,0.12)]">
                  <span className="text-[rgba(42,26,14,0.55)] block">In Review</span>
                  <span className="text-lg font-bold text-[#F4AE52]">{inquiries.filter((i) => i.status === "in_review").length}</span>
                </div>
                <div className="p-3 bg-[#FEF3E2] rounded-xl border border-[rgba(42,26,14,0.12)]">
                  <span className="text-[rgba(42,26,14,0.55)] block">Processing</span>
                  <span className="text-lg font-bold text-[#D4621A]">{inquiries.filter((i) => i.status === "processing").length}</span>
                </div>
                <div className="p-3 bg-[#FEF3E2] rounded-xl border border-[rgba(42,26,14,0.12)]">
                  <span className="text-[rgba(42,26,14,0.55)] block">Completed</span>
                  <span className="text-lg font-bold text-[#2A1A0E]">{completed}</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
