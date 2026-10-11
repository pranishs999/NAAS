"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Download, Filter, Inbox } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getInquiries, exportInquiriesCsv } from "@/lib/data/demoStore";
import { Inquiry, UserRole } from "@/types";

export default function AdminInquiriesPage(): React.JSX.Element {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [branchFilter, setBranchFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
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

  const handleExportCsv = (): void => {
    const csvContent = exportInquiriesCsv();
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `HBS_Inquiries_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = inquiries.filter((inq) => {
    const matchesSearch =
      inq.referenceCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBranch = branchFilter === "all" || inq.branch === branchFilter;
    const matchesStatus = statusFilter === "all" || inq.status === statusFilter;

    return matchesSearch && matchesBranch && matchesStatus;
  });

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
        <AdminHeader onToggleMobile={() => setMobileOpen(true)} title="Inquiry Management" />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1">
          {/* Controls Bar */}
          <div className="p-6 bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-2xl shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Search Bar (Reference Code / Name / Email) Q35 */}
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-3 text-[var(--text-secondary)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search ref code, name, email..."
                  className="w-full pl-9 pr-4 py-2 text-xs bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-xl text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--action-orange)]"
                />
              </div>

              {/* CSV Export Button (Q37) */}
              <button
                onClick={handleExportCsv}
                className="w-full sm:w-auto px-4 py-2 bg-[var(--action-orange)] text-white text-xs font-bold rounded-xl hover:opacity-90 flex items-center justify-center gap-2 shadow-xs"
              >
                <Download className="w-4 h-4" /> Export CSV
              </button>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-4 text-xs pt-2 border-t border-[var(--color-border)]">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[var(--text-secondary)]" />
                <span className="font-semibold text-[var(--text-primary)]">Branch:</span>
                <select
                  value={branchFilter}
                  onChange={(e) => setBranchFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-lg text-xs"
                >
                  <option value="all">All Branches</option>
                  <option value="visa">Documentation & Visa</option>
                  <option value="jobs">International Jobs</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-semibold text-[var(--text-primary)]">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-lg text-xs"
                >
                  <option value="all">All Statuses</option>
                  <option value="new">New</option>
                  <option value="in_review">In Review</option>
                  <option value="contacted">Contacted</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <span className="text-[var(--text-secondary)] ml-auto font-medium">
                Showing {filtered.length} of {inquiries.length} Inquiries
              </span>
            </div>
          </div>

          {/* Inquiries Table */}
          <div className="p-6 bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-2xl shadow-xs space-y-4">
            {filtered.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] text-[var(--text-secondary)] uppercase tracking-wider">
                      <th className="py-3 px-3">Ref Code</th>
                      <th className="py-3 px-3">Applicant Name</th>
                      <th className="py-3 px-3">Branch</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3">Assignee</th>
                      <th className="py-3 px-3">Date</th>
                      <th className="py-3 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)] text-[var(--text-primary)]">
                    {filtered.map((inq) => (
                      <tr key={inq.id} className="hover:bg-[var(--bg-secondary)]/50 transition-colors">
                        <td className="py-3.5 px-3 font-mono font-bold text-[var(--action-orange)]">
                          {inq.referenceCode}
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="font-semibold block">{inq.fullName}</span>
                          <span className="text-[10px] text-[var(--text-secondary)] block">{inq.email}</span>
                        </td>
                        <td className="py-3.5 px-3 capitalize font-medium">{inq.branch}</td>
                        <td className="py-3.5 px-3">
                          <StatusBadge status={inq.status} />
                        </td>
                        <td className="py-3.5 px-3 text-[var(--text-secondary)]">
                          {inq.assigneeName || "Unassigned"}
                        </td>
                        <td className="py-3.5 px-3 text-[var(--text-secondary)]">
                          {new Date(inq.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <Link
                            href={`/admin/inquiries/${inq.id}`}
                            className="px-3 py-1.5 text-xs font-bold bg-[#D4621A] text-white rounded-xl hover:opacity-90 transition-opacity"
                          >
                            Manage Timeline
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center border-2 border-dashed border-[var(--color-border)] rounded-2xl space-y-2">
                <Inbox className="w-8 h-8 mx-auto text-[var(--text-secondary)]" />
                <h4 className="text-sm font-bold text-[var(--text-primary)]">No matching inquiries found</h4>
                <p className="text-xs text-[var(--text-secondary)]">Try searching for a different reference code or clear filters.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
