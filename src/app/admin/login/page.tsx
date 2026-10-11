"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldAlert, Mail, Key, ArrowRight, Loader2 } from "lucide-react";
import { siteConfig } from "@/config/siteConfig";

function AdminLoginForm(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/admin/overview";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error?.message || "Authentication failed.");
        setIsLoading(false);
        return;
      }

      // Successful login -> Redirect
      router.push(returnUrl);
      router.refresh();
    } catch (err) {
      console.error("Login client error:", err);
      setErrorMsg("Network error trying to authenticate.");
      setIsLoading(false);
    }
  };

  const fillDemoAccount = (role: "admin" | "staff"): void => {
    if (role === "admin") {
      setEmail("admin@hbs.demo");
      setPassword("admin123");
    } else {
      setEmail("staff@hbs.demo");
      setPassword("staff123");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-3xl p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#2A1A0E] text-[var(--accent-gold)] flex items-center justify-center font-black text-xl shadow-md">
            HBS
          </div>
          <h1 className="text-2xl font-black text-[var(--text-primary)]">Admin Portal Login</h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Sign in to manage inquiries, services, users, and settings for {siteConfig.companyName}.
          </p>
        </div>

        {/* NON-PRODUCTION SECURITY WARNING BOX (Q82, security.md §1.3) */}
        <div className="p-4 bg-[var(--action-orange)]/10 border border-[var(--action-orange)]/20 rounded-2xl text-xs text-[var(--action-orange)] space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-[var(--action-orange)]">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>Non-Production Security Warning</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            This demo environment uses a simulated authentication layer with signed cookies. Do not enter real sensitive credentials.
          </p>
        </div>

        {/* Quick Demo Credentials Prefill Buttons */}
        <div className="p-3 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--color-border)] space-y-2">
          <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] block text-center">
            Click to Prefill Demo Credentials
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillDemoAccount("admin")}
              className="px-3 py-2 text-xs font-bold bg-[var(--action-orange)] text-white rounded-xl hover:opacity-90 transition-opacity"
            >
              Demo Admin (Full)
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount("staff")}
              className="px-3 py-2 text-xs font-bold bg-[var(--text-secondary)] text-white rounded-xl hover:opacity-90 transition-opacity"
            >
              Demo Staff (Limited)
            </button>
          </div>
        </div>

        {errorMsg && (
          <div role="alert" className="p-3 bg-[var(--color-error)]/10 border border-[var(--color-error)]/20 rounded-xl text-xs text-[var(--color-error)] font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-[var(--text-secondary)]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@hbs.demo"
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--action-orange)] text-[var(--text-primary)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
              Password
            </label>
            <div className="relative">
              <Key className="w-4 h-4 absolute left-3 top-3 text-[var(--text-secondary)]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--action-orange)] text-[var(--text-primary)]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[var(--action-orange)] hover:opacity-90 text-white font-bold text-sm rounded-xl shadow-md transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Verifying Session...
              </>
            ) : (
              <>
                Sign In to Dashboard <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 text-[11px] text-[var(--text-secondary)]">
          <span>Forgot Password? Recovery requires email provider configuration (CLIENT INPUT REQUIRED).</span>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage(): React.JSX.Element {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--action-orange)]" />
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
