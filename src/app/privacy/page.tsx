"use client";

import React, { useState } from "react";
import { ShieldCheck, Lock, FileText, Send, CheckCircle2 } from "lucide-react";
import { siteConfig } from "@/config/siteConfig";
import { createDsrRequest } from "@/lib/data/demoStore";

export default function PrivacyTermsPage(): React.JSX.Element {
  const [dsrEmail, setDsrEmail] = useState("");
  const [dsrType, setDsrType] = useState<"access" | "deletion" | "correction" | "portability">("access");
  const [dsrNotes, setDsrNotes] = useState("");
  const [dsrSubmitted, setDsrSubmitted] = useState(false);

  const handleDsrSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!dsrEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dsrEmail)) return;

    createDsrRequest({
      requesterEmail: dsrEmail,
      requestType: dsrType,
      notes: dsrNotes || undefined,
    });

    setDsrSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-[var(--accent-gold)]/15 text-[var(--accent-gold)] rounded-full">
          Legal & Compliance Framework
        </span>
        <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tight">
          Privacy Policy & Terms of Service
        </h1>
        <p className="text-xs text-[var(--text-secondary)]">
          Last updated: October 2026 • Combined Policy Notice for {siteConfig.companyName}
        </p>
      </div>

      {/* LEGAL DISCLAIMER NOTICE (security.md §5) */}
      <div className="p-4 bg-[var(--status-amber-bg)] border border-[var(--status-amber-border)] rounded-2xl text-xs text-[var(--status-amber-text)] leading-relaxed space-y-2">
        <div className="flex items-center gap-2 font-bold">
          <ShieldCheck className="w-4 h-4 text-[var(--status-amber-text)]" />
          <span>Demo Infrastructure Disclaimer & Non-Compliance Notice</span>
        </div>
        <p>
          This document describes data processing preparation and consent frameworks for the Horizon Business Services demo application. It does not constitute legal advice and does not claim compliance with any specific data protection law. Final production policies must be reviewed by legal counsel.
        </p>
      </div>

      {/* Privacy Section */}
      <section className="p-8 bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-3xl shadow-sm space-y-4">
        <div className="flex items-center gap-2 font-bold text-xl text-[var(--text-primary)]">
          <Lock className="w-5 h-5 text-[var(--accent-gold-text)]" />
          <h2>1. Privacy Policy & Data Collection</h2>
        </div>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          Horizon Business Services collects personal information (such as full name, email address, phone number, passport copy, and qualification details) exclusively for the purpose of processing residency visa applications, document attestations, and international candidate placement.
        </p>
        <div className="p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--color-border)] text-xs font-mono text-[var(--text-primary)]">
          [CLIENT INPUT REQUIRED - Full Privacy Notice & Legal Retention Schedule Details]
        </div>
      </section>

      {/* Terms Section */}
      <section className="p-8 bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-3xl shadow-sm space-y-4">
        <div className="flex items-center gap-2 font-bold text-xl text-[var(--text-primary)]">
          <FileText className="w-5 h-5 text-[var(--accent-gold-text)]" />
          <h2>2. Terms of Service & Disclaimers</h2>
        </div>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          By utilizing this website, visitors agree that demo submissions and reference code generation are for client evaluation purposes. Official government fees, ministry approvals, and visa clearances are subject to UAE regulatory approval.
        </p>
        <div className="p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--color-border)] text-xs font-mono text-[var(--text-primary)]">
          [CLIENT INPUT REQUIRED - Terms of Service & Legal Governing Law Clause]
        </div>
      </section>

      {/* DATA SUBJECT REQUEST (DSR) FORM (security.md §5.6) */}
      <section className="p-8 bg-[var(--bg-secondary)] border border-[var(--color-border)] rounded-3xl shadow-sm space-y-6">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-[var(--text-primary)]">Data Subject Rights (DSR Workflow)</h3>
          <p className="text-xs text-[var(--text-secondary)]">
            Under UAE privacy guidelines, candidates may request access, correction, or deletion of their submitted records.
          </p>
        </div>

        {dsrSubmitted ? (
          <div className="p-6 bg-[#2A1A0E]/10 border border-[#2A1A0E]/20 rounded-2xl text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 mx-auto text-[#2A1A0E]" />
            <h4 className="text-base font-bold text-[var(--text-primary)]">DSR Request Received</h4>
            <p className="text-xs text-[var(--text-secondary)]">
              Your request for <span className="font-semibold">{dsrEmail}</span> has been logged in the admin privacy queue for verification.
            </p>
          </div>
        ) : (
          <form onSubmit={handleDsrSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                  Requester Email Address <span className="text-[#D4621A]">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={dsrEmail}
                  onChange={(e) => setDsrEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2.5 text-xs bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-xl text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                  Request Type
                </label>
                <select
                  value={dsrType}
                  onChange={(e) => setDsrType(e.target.value as unknown as "access")}
                  className="w-full px-3 py-2.5 text-xs bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-xl text-[var(--text-primary)]"
                >
                  <option value="access">Request Copy of Personal Data</option>
                  <option value="deletion">Request Account / Record Deletion</option>
                  <option value="correction">Request Record Correction</option>
                  <option value="portability">Request Data Export</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                Additional Context / Notes
              </label>
              <textarea
                rows={2}
                value={dsrNotes}
                onChange={(e) => setDsrNotes(e.target.value)}
                placeholder="Specify reference codes or specific details to help verify your request..."
                className="w-full p-3 text-xs bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-xl text-[var(--text-primary)]"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-[#D4621A] text-white text-xs font-bold rounded-xl hover:opacity-90 inline-flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" /> Submit Data Subject Request
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
