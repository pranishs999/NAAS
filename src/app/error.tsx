"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): React.JSX.Element {
  useEffect(() => {
    console.error("Application Error Boundary caught error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 bg-[var(--bg-primary)] border border-[#D4621A]/20 rounded-3xl text-center space-y-6 shadow-xl">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#D4621A]/10 text-[#D4621A] flex items-center justify-center">
          <AlertCircle className="w-10 h-10" />
        </div>

        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Something Went Wrong</h1>
          <p className="text-xs text-[var(--text-secondary)] mt-2 leading-relaxed">
            An unexpected error occurred while loading this section. You may retry the action or return home.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#D4621A] text-white font-bold text-xs rounded-xl hover:opacity-90 inline-flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Try Again
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 border border-[var(--color-border)] text-[var(--text-primary)] font-semibold text-xs rounded-xl hover:bg-[var(--bg-secondary)] flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" /> Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
