"use client";

import React, { useState, useEffect } from "react";
import { Settings as SettingsIcon, Download, Upload, RotateCcw, Save, ShieldAlert, CheckCircle2 } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { siteConfig, SiteConfig } from "@/config/siteConfig";
import { exportFullBackup, restoreBackup, resetSampleData } from "@/lib/data/demoStore";
import { UserRole } from "@/types";

export default function AdminSettingsPage(): React.JSX.Element {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [configData, setConfigData] = useState<SiteConfig>(siteConfig);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>("admin");
  const [userName, setUserName] = useState("System Admin (Demo)");

  useEffect(() => {
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

  const handleSaveCompanyConfig = (e: React.FormEvent): void => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleDownloadBackup = (): void => {
    const json = exportFullBackup();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.setAttribute("download", `HBS_Demo_Full_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleRestoreFile = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result as string;
      const success = restoreBackup(content);
      if (success) {
        alert("Demo store backup restored successfully! Reloading page...");
        window.location.reload();
      } else {
        alert("Invalid backup file structure.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleExecuteReset = (): void => {
    resetSampleData();
    setShowResetConfirm(false);
    alert("Demo store reset to initial sample state.");
    window.location.reload();
  };

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
        <AdminHeader onToggleMobile={() => setMobileOpen(true)} title="System & Company Settings" />

        <main className="p-4 sm:p-6 lg:p-8 space-y-8 flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Company & Infrastructure Configuration</h2>
              <p className="text-xs text-[var(--text-secondary)]">Centralized settings, backup downloads, restore, and notification rules.</p>
            </div>
            {savedSuccess && (
              <span className="text-xs font-bold text-[#2A1A0E] bg-[#2A1A0E]/10 px-3 py-1.5 rounded-xl flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Settings Saved!
              </span>
            )}
          </div>

          {/* BACKUP & RESTORE SECTION (Q47, Q71) */}
          <div className="p-6 bg-[var(--bg-primary)] border-2 border-[var(--action-orange)]/30 rounded-3xl shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
              <div>
                <h3 className="text-base font-bold text-[var(--text-primary)]">Demo Data Backup & Restore Operations</h3>
                <p className="text-xs text-[var(--text-secondary)]">Download JSON data file, restore previous backups, or reset sample data.</p>
              </div>
              <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase bg-[var(--action-orange)]/15 text-[var(--action-orange)] rounded">
                Demo Persistence API
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <button
                onClick={handleDownloadBackup}
                className="p-4 bg-[var(--bg-secondary)] border border-[var(--color-border)] hover:border-[var(--action-orange)] rounded-2xl text-left space-y-2 transition-all group"
              >
                <Download className="w-6 h-6 text-[var(--action-orange)] group-hover:scale-105 transition-transform" />
                <div>
                  <span className="font-bold text-xs text-[var(--text-primary)] block">Export Backup File</span>
                  <span className="text-[10px] text-[var(--text-secondary)]">Download full JSON snapshot of all demo data.</span>
                </div>
              </button>

              <label className="p-4 bg-[var(--bg-secondary)] border border-[var(--color-border)] hover:border-[var(--action-orange)] rounded-2xl text-left space-y-2 cursor-pointer transition-all group block">
                <Upload className="w-6 h-6 text-[var(--action-orange)] group-hover:scale-110 transition-transform" />
                <div>
                  <span className="font-bold text-xs text-[var(--text-primary)] block">Restore Backup</span>
                  <span className="text-[10px] text-[var(--text-secondary)]">Upload JSON backup to restore state.</span>
                </div>
                <input type="file" accept=".json" onChange={handleRestoreFile} className="hidden" />
              </label>

              <button
                onClick={() => setShowResetConfirm(true)}
                className="p-4 bg-[var(--color-error)]/5 border border-[var(--color-error)]/20 hover:border-[var(--color-error)] rounded-2xl text-left space-y-2 transition-all group"
              >
                <RotateCcw className="w-6 h-6 text-[var(--color-error)] group-hover:rotate-180 transition-transform duration-500" />
                <div>
                  <span className="font-bold text-xs text-[var(--color-error)] block">Reset Sample Data</span>
                  <span className="text-[10px] text-[var(--text-secondary)]">One-click reset to initial demo state [Q71].</span>
                </div>
              </button>
            </div>
          </div>

          {/* Centralized Company Details Form (Q27, Q48) */}
          <div className="p-6 bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-2xl shadow-xs space-y-6">
            <h3 className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--color-border)] pb-3">
              Centralized Company Contact Details
            </h3>

            <form onSubmit={handleSaveCompanyConfig} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Company Name</label>
                  <input
                    type="text"
                    value={configData.companyName}
                    onChange={(e) => setConfigData({ ...configData, companyName: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-xl text-[var(--text-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Tagline</label>
                  <input
                    type="text"
                    value={configData.tagline}
                    onChange={(e) => setConfigData({ ...configData, tagline: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-xl text-[var(--text-primary)] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Telephone</label>
                  <input
                    type="text"
                    value={configData.phone}
                    onChange={(e) => setConfigData({ ...configData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-xl text-[var(--text-primary)] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Official Email</label>
                  <input
                    type="email"
                    value={configData.email}
                    onChange={(e) => setConfigData({ ...configData, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-xl text-[var(--text-primary)] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">WhatsApp Number</label>
                  <input
                    type="text"
                    value={configData.whatsAppNumber}
                    onChange={(e) => setConfigData({ ...configData, whatsAppNumber: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-xl text-[var(--text-primary)] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Physical Address</label>
                <input
                  type="text"
                  value={configData.physicalAddress}
                  onChange={(e) => setConfigData({ ...configData, physicalAddress: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-xl text-[var(--text-primary)] font-mono"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[var(--action-orange)] text-white text-xs font-bold rounded-xl hover:opacity-90 inline-flex items-center gap-1.5 shadow-sm"
                >
                  <Save className="w-4 h-4" /> Save Company Details
                </button>
              </div>
            </form>
          </div>

          {/* NOTIFICATION RULES (SIMULATED / OPEN - Q55, Q91) */}
          <div className="p-6 bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-2xl shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
              <h3 className="text-base font-bold text-[var(--text-primary)]">Notification Dispatch Rules</h3>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-[var(--action-orange)]/10 text-[var(--action-orange)] rounded">
                SIMULATED / OPEN
              </span>
            </div>

            <div className="p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--color-border)] text-xs text-[var(--text-secondary)] space-y-2">
              <p className="font-semibold text-[var(--text-primary)]">
                Notification Delivery Status: OPEN [Q55, Q91]
              </p>
              <p>
                Email, SMS, and WhatsApp Business API delivery rules are currently unconfigured. In-app toasts simulate events locally.
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showResetConfirm}
        title="Reset Demo Data Store?"
        message="This operation will erase all current local changes and restore the original sample services, inquiries, users, and settings. This cannot be undone."
        confirmLabel="Reset Sample Data"
        cancelLabel="Keep Current Data"
        variant="danger"
        onConfirm={handleExecuteReset}
        onCancel={() => setShowResetConfirm(false)}
      />
    </div>
  );
}
