import React from "react";
import Link from "next/link";
import { FileQuestion, ArrowLeft, Home } from "lucide-react";

export default function NotFound(): React.JSX.Element {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-3xl text-center space-y-6 shadow-xl">
        <div className="w-16 h-16 mx-auto rounded-full bg-[var(--accent-gold)]/15 text-[var(--accent-gold)] flex items-center justify-center">
          <FileQuestion className="w-10 h-10" />
        </div>

        <div>
          <span className="text-4xl font-black text-[var(--text-primary)] block">404</span>
          <h1 className="text-xl font-bold text-[var(--text-primary)] mt-1">Page Not Found</h1>
          <p className="text-xs text-[var(--text-secondary)] mt-2 leading-relaxed">
            We could not find the requested page or record on Horizon Business Services.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 bg-[#D4621A] text-white font-bold text-xs rounded-xl hover:opacity-90 inline-flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" /> Return to Home
          </Link>
          <Link
            href="/services/visa"
            className="w-full sm:w-auto px-5 py-2.5 border border-[var(--color-border)] text-[var(--text-primary)] font-semibold text-xs rounded-xl hover:bg-[var(--bg-secondary)]"
          >
            Browse Visa Services
          </Link>
        </div>
      </div>
    </div>
  );
}
