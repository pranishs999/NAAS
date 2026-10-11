"use client";

import React, { useEffect, useRef } from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "primary";
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "primary",
  onConfirm,
  onCancel,
}: ConfirmDialogProps): React.JSX.Element | null {
  const dialogRef = useRef<HTMLDivElement>(null);
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      confirmBtnRef.current?.focus();
      const handleKeyDown = (e: KeyboardEvent): void => {
        if (e.key === "Escape") onCancel();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const btnStyles = {
    danger: "bg-[var(--color-error)] hover:opacity-90 text-white focus:ring-[var(--color-error)]",
    warning: "bg-[var(--action-orange)] hover:opacity-90 text-white focus:ring-[var(--action-orange)]",
    primary: "bg-[var(--action-orange)] hover:opacity-90 text-white focus:ring-[var(--action-orange)]",
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in"
    >
      <div
        ref={dialogRef}
        className="w-full max-w-md p-6 bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-2xl shadow-2xl animate-in zoom-in-95"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[var(--action-orange)]/10 text-[var(--action-orange)]">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 id="confirm-dialog-title" className="text-lg font-bold text-[var(--text-primary)]">
              {title}
            </h3>
          </div>
          <button
            onClick={onCancel}
            aria-label="Close modal"
            className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">{message}</p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium border border-[var(--color-border)] rounded-xl hover:bg-[var(--bg-secondary)] focus:outline-none focus:ring-2 focus:ring-[#2A1A0E]/30"
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmBtnRef}
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium rounded-xl focus:outline-none focus:ring-2 ${btnStyles[variant]}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
