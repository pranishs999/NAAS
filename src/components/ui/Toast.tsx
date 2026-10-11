"use client";

import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

export function Toast({ toast, onDismiss }: ToastProps): React.JSX.Element {
  const { id, type, message, duration = 4000 } = toast;

  useEffect(() => {
    if (duration <= 0) return;
    const timer = setTimeout(() => {
      onDismiss(id);
    }, duration);
    return () => clearTimeout(timer);
  }, [id, duration, onDismiss]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-[#2A1A0E]" />,
    error: <AlertCircle className="w-5 h-5 text-[#D4621A]" />,
    warning: <AlertTriangle className="w-5 h-5 text-[#D4621A]" />,
    info: <Info className="w-5 h-5 text-[#D4621A]" />,
  };

  const borders = {
    success: "border-[#2A1A0E]/30 bg-[#2A1A0E]/10 text-[#2A1A0E]",
    error: "border-[#D4621A]/30 bg-[#D4621A]/10 text-[#D4621A]",
    warning: "border-[#D4621A]/30 bg-[#D4621A]/10 text-[#D4621A]",
    info: "border-[#D4621A]/30 bg-[#FEF3E2] text-[#2A1A0E]",
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`flex items-center gap-3 p-4 rounded-xl border shadow-xs transition-all transform animate-in fade-in slide-in-from-bottom-2 ${borders[type]}`}
    >
      <div className="flex-shrink-0">{icons[type]}</div>
      <div className="flex-1 text-sm font-medium">{message}</div>
      <button
        onClick={() => onDismiss(id)}
        className="p-1 rounded-lg hover:opacity-75 focus:outline-none"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
