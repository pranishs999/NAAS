import React from "react";
import { siteConfig } from "@/config/siteConfig";
import { ShieldCheck, Target, Award, CheckCircle2 } from "lucide-react";

export default function AboutPage(): React.JSX.Element {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-[var(--accent-gold)]/15 text-[var(--accent-gold)] rounded-full">
          About {siteConfig.companyName}
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-[var(--text-primary)] tracking-tight">
          Empowering Business Residency & Global Careers
        </h1>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          Horizon Business Services operates two core operational branches under one single brand, delivering unified government liaison documentation and international placement guidance in Dubai, UAE.
        </p>
      </div>

      {/* Overview Card */}
      <div className="p-8 bg-[var(--bg-secondary)] border border-[var(--color-border)] rounded-3xl shadow-sm space-y-4">
        <h2 className="text-2xl font-black text-[var(--text-primary)]">Company Overview</h2>
        <div className="p-4 bg-[var(--action-orange)]/10 border border-[var(--action-orange)]/20 rounded-xl text-xs font-mono text-[var(--action-orange)]">
          [CLIENT INPUT REQUIRED - Full Company Overview & History Text]
        </div>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          {siteConfig.mission}
        </p>
      </div>

      {/* Mission & Vision Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 bg-[var(--bg-secondary)] border border-[var(--color-border)] rounded-2xl shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[var(--action-orange)]/15 text-[var(--action-orange)] flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-[var(--text-primary)]">Our Mission</h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-mono">
            {siteConfig.mission}
          </p>
        </div>

        <div className="p-8 bg-[var(--bg-secondary)] border border-[var(--color-border)] rounded-2xl shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[var(--action-orange)]/15 text-[var(--action-orange)] flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-[var(--text-primary)]">Our Vision</h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-mono">
            {siteConfig.vision}
          </p>
        </div>
      </div>

      {/* Core Values */}
      <div className="p-8 bg-[var(--bg-secondary)] border border-[var(--color-border)] rounded-3xl shadow-sm space-y-6">
        <h3 className="text-2xl font-black text-[var(--text-primary)]">Core Values</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {siteConfig.values.map((val, idx) => (
            <div key={idx} className="p-4 bg-[var(--bg-primary)] rounded-xl border border-[var(--color-border)]">
              <span className="text-xs font-bold text-[var(--action-orange)] block mb-1">Value 0{idx + 1}</span>
              <p className="text-xs font-mono text-[var(--text-primary)]">{val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Credentials & Trust Indicators */}
      <div className="p-8 bg-[var(--bg-secondary)] border border-[var(--color-border)] rounded-3xl shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-[var(--color-success)]" />
          <h3 className="text-2xl font-black text-[var(--text-primary)]">Credentials & Government Approvals</h3>
        </div>
        <ul className="space-y-3 text-xs text-[var(--text-primary)]">
          {siteConfig.credentials.map((cred, idx) => (
            <li key={idx} className="flex items-center gap-2 font-mono">
              <CheckCircle2 className="w-4 h-4 text-[var(--color-success)] flex-shrink-0" />
              <span>{cred}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
