"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, Search, Info } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { getAuditLogs } from "@/lib/data/demoStore";
import { AuditLog, UserRole } from "@/types";

export default function AdminAuditLogsPage(): React.JSX.Element {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [userRole, setUserRole] = useState<UserRole>("admin");
  const [userName, setUserName] = useState("System Admin (Demo)");

  useEffect(() => {
    setLogs(getAuditLogs());
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

  const filteredLogs = logs.filter((l) =>
    l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (l.entityType && l.entityType.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
        <AdminHeader onToggleMobile={() => setMobileOpen(true)} title="System Audit Logs" />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1">
          <div className="p-4 bg-[var(--action-orange)]/10 border border-[var(--action-orange)]/20 rounded-2xl text-xs text-[var(--action-orange)] space-y-1">
            <div className="flex items-center gap-2 font-bold">
              <Info className="w-4 h-4 text-[var(--action-orange)]" />
              <span>Audit Log Scope (Provisional Baseline - Q83 OPEN)</span>
            </div>
            <p>
              Events recorded include inquiry submissions, status updates, user management changes, and backup operations. Audit logs are append-only.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-3 text-[var(--text-secondary)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search actions, users, entities..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-xl text-[var(--text-primary)]"
              />
            </div>

            <span className="text-xs text-[var(--text-secondary)] font-medium">
              Total Logged Events: {filteredLogs.length}
            </span>
          </div>

          <div className="p-6 bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-2xl shadow-xs overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-[var(--text-secondary)] uppercase tracking-wider">
                  <th className="py-3 px-3">Timestamp</th>
                  <th className="py-3 px-3">User</th>
                  <th className="py-3 px-3">Action Event</th>
                  <th className="py-3 px-3">Entity Type</th>
                  <th className="py-3 px-3">Details</th>
                  <th className="py-3 px-3">Demo Label</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)] text-[var(--text-primary)] font-mono">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[var(--bg-secondary)]/50 transition-colors">
                    <td className="py-3.5 px-3 text-[var(--text-secondary)]">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 font-bold">{log.userName}</td>
                    <td className="py-3.5 px-3 font-semibold text-[var(--action-orange)]">
                      {log.action}
                    </td>
                    <td className="py-3.5 px-3 text-[var(--text-secondary)]">{log.entityType || "-"}</td>
                    <td className="py-3.5 px-3 text-[11px] text-[var(--text-secondary)] max-w-xs truncate">
                      {log.details ? JSON.stringify(log.details) : "-"}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-[var(--action-orange)]/10 text-[var(--action-orange)] rounded">
                        DEMO EVENT
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
