"use client";

import React, { useState } from "react";
import { Briefcase, CheckCircle2, ShieldAlert, ArrowRight } from "lucide-react";
import { getVacancies } from "@/lib/data/demoStore";
import { MultiStepForm } from "@/components/forms/MultiStepForm";

export default function JobServicesPage(): React.JSX.Element {
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const vacancies = getVacancies();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 text-xs font-bold uppercase tracking-wider bg-[#F4AE52]/20 text-[#D4621A] border border-[#F4AE52]/40 rounded-full">
          <Briefcase className="w-4 h-4 text-[#D4621A]" />
          <span>Branch 02 — International Job Services</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-[var(--text-primary)] tracking-tight">
          Overseas Career Placement & Documentation Assistance
        </h1>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          We guide candidates through qualification verification, CV formatting, embassy attestation, and international employment visa readiness.
        </p>
      </div>

      {/* PROCESS-FIRST PRESENTATION (Q13, Q14) */}
      <div className="p-8 bg-[var(--bg-secondary)] border border-[var(--color-border)] rounded-3xl shadow-sm space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-black text-[var(--text-primary)]">Candidate Assistance Workflow</h2>
          <p className="text-xs text-[var(--text-secondary)] mt-1">Our step-by-step process for international candidates</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div className="p-5 bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-2xl">
            <div className="w-10 h-10 mx-auto rounded-xl bg-[var(--accent-gold)]/20 text-[var(--accent-gold)] font-black text-base flex items-center justify-center mb-3">
              01
            </div>
            <h4 className="text-sm font-bold text-[var(--text-primary)]">Candidate Registration</h4>
            <p className="text-xs text-[var(--text-secondary)] mt-1">Submit your career details, preferred role, and educational background.</p>
          </div>

          <div className="p-5 bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-2xl">
            <div className="w-10 h-10 mx-auto rounded-xl bg-[var(--accent-gold)]/20 text-[var(--accent-gold)] font-black text-base flex items-center justify-center mb-3">
              02
            </div>
            <h4 className="text-sm font-bold text-[var(--text-primary)]">Document Attestation</h4>
            <p className="text-xs text-[var(--text-secondary)] mt-1">Verify educational degrees and work experience certificates.</p>
          </div>

          <div className="p-5 bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-2xl">
            <div className="w-10 h-10 mx-auto rounded-xl bg-[var(--accent-gold)]/20 text-[var(--accent-gold)] font-black text-base flex items-center justify-center mb-3">
              03
            </div>
            <h4 className="text-sm font-bold text-[var(--text-primary)]">Opportunity Review</h4>
            <p className="text-xs text-[var(--text-secondary)] mt-1">Match candidate qualifications against international client openings.</p>
          </div>

          <div className="p-5 bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-2xl">
            <div className="w-10 h-10 mx-auto rounded-xl bg-[var(--accent-gold)]/20 text-[var(--accent-gold)] font-black text-base flex items-center justify-center mb-3">
              04
            </div>
            <h4 className="text-sm font-bold text-[var(--text-primary)]">Visa Clearance</h4>
            <p className="text-xs text-[var(--text-secondary)] mt-1">Seamless transition to work permit typing and entry visa clearance.</p>
          </div>
        </div>
      </div>

      {/* SAMPLE VACANCIES SECTION (Q14 ANSWER - LABELED FICTIONAL DEMO) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-black text-[var(--text-primary)]">Sample Vacancies</h3>
              <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase bg-[var(--action-orange)]/15 text-[var(--action-orange)] rounded">
                FICTIONAL DEMO
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Sample job listings provided for workflow evaluation purposes.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vacancies.map((vac) => (
            <div
              key={vac.id}
              className="p-6 bg-[var(--bg-secondary)] border border-[var(--color-border)] rounded-2xl shadow-sm space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--action-orange)]">
                    {vac.industry}
                  </span>
                  <h4 className="text-lg font-bold text-[var(--text-primary)]">{vac.title}</h4>
                  <span className="text-xs text-[var(--text-secondary)] font-medium">
                    {vac.location} • {vac.type}
                  </span>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-[var(--action-orange)]/10 text-[var(--action-orange)] rounded">
                  Demo Listing
                </span>
              </div>

              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{vac.description}</p>

              <div className="space-y-1.5 pt-2 border-t border-[var(--color-border)]">
                <span className="text-[10px] font-bold uppercase text-[var(--text-secondary)]">Requirements</span>
                <ul className="text-xs text-[var(--text-primary)] space-y-1">
                  {vac.requirements.map((req, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-success)] flex-shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* INQUIRY FORM CTA / INLINE FORM */}
      <div className="p-8 bg-[var(--bg-secondary)] border border-[var(--color-border)] rounded-3xl shadow-xl space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h3 className="text-2xl font-black text-[var(--text-primary)]">Start Your International Career Inquiry</h3>
          <p className="text-xs text-[var(--text-secondary)]">
            Submit your background details to receive a category-prefixed reference code and WhatsApp follow-up link.
          </p>
        </div>

        {!showInquiryForm ? (
          <div className="text-center pt-2">
            <button
              onClick={() => setShowInquiryForm(true)}
              className="px-8 py-3.5 bg-[var(--action-orange)] hover:opacity-90 text-white font-bold text-sm rounded-xl shadow-md transition-all inline-flex items-center gap-2"
            >
              Open Job Inquiry Form <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="pt-4">
            <MultiStepForm initialBranch="jobs" onCancel={() => setShowInquiryForm(false)} />
          </div>
        )}
      </div>
    </div>
  );
}
