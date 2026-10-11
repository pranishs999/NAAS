"use client";

import React, { useState } from "react";
import { Phone, Mail, MapPin, Clock, MessageSquare, Map } from "lucide-react";
import { siteConfig } from "@/config/siteConfig";
import { MultiStepForm } from "@/components/forms/MultiStepForm";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";

export default function ContactPage(): React.JSX.Element {
  const [activeBranch, setActiveBranch] = useState<"visa" | "jobs">("visa");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider bg-[#F4AE52]/25 text-[#D4621A] border border-[#F4AE52]/40 rounded-full inline-block">
          Get in Touch
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-[#2A1A0E] tracking-tight">
          Contact Horizon Business Services
        </h1>
        <p className="text-sm text-[rgba(42,26,14,0.55)] leading-relaxed">
          Select your inquiry branch below or reach out via direct phone, email, or WhatsApp.
        </p>
      </div>

      {/* SPLIT LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Col: Contact Details & Quick Actions */}
        <div className="lg:col-span-5 space-y-8">
          <div className="p-8 bg-white border border-[rgba(42,26,14,0.12)] rounded-3xl space-y-6 shadow-xs">
            <h3 className="text-xl font-bold text-[#2A1A0E]">Contact Channels</h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-[#FEF3E2] text-[#D4621A] flex-shrink-0 border border-[rgba(42,26,14,0.12)]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-[#2A1A0E] block">Physical Address</span>
                  <span className="text-[rgba(42,26,14,0.55)] font-mono">{siteConfig.physicalAddress}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-[#FEF3E2] text-[#D4621A] flex-shrink-0 border border-[rgba(42,26,14,0.12)]">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-[#2A1A0E] block">Telephone (Click-to-Call)</span>
                  <a
                    href={`tel:${siteConfig.phone}`}
                    className="text-[#D4621A] font-mono hover:underline font-bold"
                  >
                    {siteConfig.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-[#FEF3E2] text-[#D4621A] flex-shrink-0 border border-[rgba(42,26,14,0.12)]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-[#2A1A0E] block">Official Email</span>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="text-[#D4621A] font-mono hover:underline font-bold"
                  >
                    {siteConfig.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-[#FEF3E2] text-[#2A1A0E] flex-shrink-0 border border-[rgba(42,26,14,0.12)]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-[#2A1A0E] block">Office Hours</span>
                  <span className="text-[rgba(42,26,14,0.55)] font-mono">{siteConfig.officeHours}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[rgba(42,26,14,0.12)]">
              <span className="text-xs font-bold text-[#2A1A0E] block mb-3">Direct WhatsApp Contact</span>
              <WhatsAppButton variant="followup" label="Chat Directly on WhatsApp" />
            </div>
          </div>

          {/* Embedded Map Placeholder */}
          <div className="p-6 bg-white border border-[rgba(42,26,14,0.12)] rounded-3xl shadow-xs text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-xl bg-[#FEF3E2] text-[#D4621A] border border-[rgba(42,26,14,0.12)] flex items-center justify-center">
              <Map className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#2A1A0E]">Interactive Map Location</h4>
              <p className="text-xs text-[rgba(42,26,14,0.55)] mt-1 font-mono">
                [CLIENT INPUT REQUIRED - Map Provider API Key & Embed URL]
              </p>
            </div>
            <div className="h-40 bg-[#FEF3E2] border border-dashed border-[rgba(42,26,14,0.12)] rounded-2xl flex items-center justify-center text-xs text-[rgba(42,26,14,0.55)]">
              Interactive Map Frame Placeholder
            </div>
          </div>
        </div>

        {/* Right Col: Branch Inquiry Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-4 bg-white border border-[rgba(42,26,14,0.12)] rounded-2xl flex items-center justify-between shadow-xs">
            <span className="text-xs font-bold text-[#2A1A0E]">Inquiry Branch Selection:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveBranch("visa")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  activeBranch === "visa"
                    ? "bg-[#D4621A] text-white shadow-xs"
                    : "bg-[#FEF3E2] border border-[rgba(42,26,14,0.12)] text-[rgba(42,26,14,0.55)] hover:text-[#2A1A0E]"
                }`}
              >
                Documentation & Visa
              </button>
              <button
                onClick={() => setActiveBranch("jobs")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  activeBranch === "jobs"
                    ? "bg-[#2A1A0E] text-white shadow-xs"
                    : "bg-[#FEF3E2] border border-[rgba(42,26,14,0.12)] text-[rgba(42,26,14,0.55)] hover:text-[#2A1A0E]"
                }`}
              >
                International Jobs
              </button>
            </div>
          </div>

          <MultiStepForm initialBranch={activeBranch} key={activeBranch} />
        </div>
      </div>
    </div>
  );
}
