"use client";

import React, { useEffect, useState } from "react";
import { Cookie, Check, X, Settings } from "lucide-react";

export function CookieBanner(): React.JSX.Element | null {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analyticsConsent, setAnalyticsConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("hbs_cookie_consent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAcceptAll = (): void => {
    localStorage.setItem("hbs_cookie_consent", JSON.stringify({ essential: true, analytics: true, timestamp: new Date().toISOString() }));
    setVisible(false);
  };

  const handleRejectNonEssential = (): void => {
    localStorage.setItem("hbs_cookie_consent", JSON.stringify({ essential: true, analytics: false, timestamp: new Date().toISOString() }));
    setVisible(false);
  };

  const handleSaveCustom = (): void => {
    localStorage.setItem("hbs_cookie_consent", JSON.stringify({ essential: true, analytics: analyticsConsent, timestamp: new Date().toISOString() }));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent preferences"
      className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-lg z-50 p-6 bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-2xl shadow-2xl animate-in slide-in-from-bottom-5"
    >
      <div className="flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] flex-shrink-0">
          <Cookie className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h4 className="text-base font-bold text-[var(--text-primary)] mb-1">Privacy & Cookie Preferences</h4>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
            We use essential cookies to maintain system functionality and optional analytics cookies to evaluate demo usage.
          </p>

          {showSettings && (
            <div className="my-4 p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--color-border)] space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[var(--text-primary)] block">Essential Cookies</span>
                  <span className="text-[var(--text-secondary)]">Required for session state and accessibility.</span>
                </div>
                <span className="px-2 py-0.5 bg-[var(--color-border)] text-[10px] font-bold rounded text-[var(--text-secondary)]">
                  Always Active
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)]">
                <div>
                  <span className="font-semibold text-[var(--text-primary)] block">Analytics Cookies</span>
                  <span className="text-[var(--text-secondary)]">Anonymous usage metrics for performance review.</span>
                </div>
                <input
                  type="checkbox"
                  checked={analyticsConsent}
                  onChange={(e) => setAnalyticsConsent(e.target.checked)}
                  className="w-4 h-4 rounded text-[var(--action-orange)] focus:ring-[var(--action-orange)]"
                />
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2">
            {!showSettings ? (
              <>
                <button
                  onClick={handleAcceptAll}
                  className="px-4 py-2 bg-[var(--action-orange)] hover:opacity-90 text-white font-semibold text-xs rounded-xl transition-opacity flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" /> Accept All
                </button>
                <button
                  onClick={handleRejectNonEssential}
                  className="px-3.5 py-2 border border-[var(--color-border)] hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] font-medium text-xs rounded-xl"
                >
                  Essential Only
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg text-xs flex items-center gap-1"
                >
                  <Settings className="w-3.5 h-3.5" /> Preferences
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSaveCustom}
                  className="px-4 py-2 bg-[var(--action-orange)] hover:opacity-90 text-white font-semibold text-xs rounded-xl"
                >
                  Save Preferences
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-3 py-2 border border-[var(--color-border)] text-xs rounded-xl"
                >
                  Back
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
