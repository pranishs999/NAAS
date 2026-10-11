"use client";

import React, { useState } from "react";
import { Lock, AlertTriangle, X, Loader2 } from "lucide-react";

interface ReauthModalProps {
  isOpen: boolean;
  actionTitle: string;
  actionDescription: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ReauthModal({
  isOpen,
  actionTitle,
  actionDescription,
  onSuccess,
  onCancel,
}: ReauthModalProps): React.JSX.Element | null {
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const handleVerify = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setErrorMsg(null);
    setIsVerifying(true);

    try {
      const res = await fetch("/api/auth/reauth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error?.message || "Invalid password for sensitive action verification.");
        setIsVerifying(false);
        return;
      }

      setIsVerifying(false);
      onSuccess();
    } catch (err) {
      console.error("Reauth error:", err);
      setErrorMsg("Failed to verify credentials.");
      setIsVerifying(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reauth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
    >
      <div className="w-full max-w-md p-6 bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-3xl shadow-2xl space-y-4 animate-in zoom-in-95">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[var(--color-error)]/10 text-[var(--color-error)]">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-error)]">
                Security Step: Re-Authentication
              </span>
              <h3 id="reauth-modal-title" className="text-lg font-bold text-[var(--text-primary)]">
                Confirm Sensitive Action
              </h3>
            </div>
          </div>
          <button onClick={onCancel} className="p-1 text-[var(--text-secondary)] rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 bg-[var(--action-orange)]/10 border border-[var(--action-orange)]/20 rounded-xl text-xs text-[var(--action-orange)]">
          <span className="font-bold block">{actionTitle}</span>
          <span className="text-[11px] block mt-0.5">{actionDescription}</span>
        </div>

        {errorMsg && (
          <div className="p-2.5 bg-[#D4621A]/10 border border-[#D4621A]/20 rounded-xl text-xs text-[#D4621A] font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
              Enter Admin Password to Proceed
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="e.g. admin123"
              className="w-full px-3 py-2.5 text-sm bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-xl text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--action-orange)]"
            />
            <span className="text-[10px] text-[var(--text-secondary)] mt-1 block">
              Demo credentials: admin123 or staff123
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-xs font-semibold border border-[var(--color-border)] rounded-xl hover:bg-[var(--bg-secondary)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isVerifying}
              className="px-5 py-2 text-xs font-bold text-white bg-[var(--color-error)] hover:opacity-90 rounded-xl flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Verifying...
                </>
              ) : (
                "Authorize & Execute"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
