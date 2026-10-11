import React from "react";
import Link from "next/link";
import { ShieldCheck, MapPin, Phone, Mail, MessageSquare } from "lucide-react";
import { siteConfig } from "@/config/siteConfig";
import { CopyrightYear } from "@/components/ui/CopyrightYear";

export function Footer(): React.JSX.Element {
  return (
    <footer className="bg-[#FEF3E2] border-t border-[rgba(42,26,14,0.12)] text-[#2A1A0E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Brand & Disclaimer */}
          <div className="lg:col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#2A1A0E] text-[#F4AE52] flex items-center justify-center font-black text-xl shadow-xs">
                  HBS
                </div>
                <div>
                  <span className="font-extrabold text-lg tracking-tight text-[#2A1A0E]">
                    {siteConfig.companyName}
                  </span>
                  <span className="block text-[10px] font-bold text-[#D4621A]">
                    FICTIONAL DEMO WEBSITE
                  </span>
                </div>
              </div>
              <p className="text-xs text-[rgba(42,26,14,0.55)] leading-relaxed mb-4 max-w-sm">
                Providing comprehensive Documentation & Visa Services and International Job Services for clients across the UAE and globally.
              </p>
              <div className="inline-flex items-center gap-2 p-3 bg-[#FEF3E2] border border-[rgba(42,26,14,0.12)] rounded-xl text-xs text-[#D4621A]">
                <ShieldCheck className="w-4 h-4 flex-shrink-0 text-[#D4621A]" />
                <span>Notice: All data shown on this website is for demonstration purposes only.</span>
              </div>
            </div>
          </div>

          {/* Col 2: Visa Services Branch */}
          <div>
            <h4 className="text-sm font-bold tracking-wider uppercase text-[#2A1A0E] mb-4">
              Documentation & Visa
            </h4>
            <ul className="space-y-2.5 text-xs text-[rgba(42,26,14,0.55)]">
              <li>
                <Link href="/services/visa" className="hover:text-[#D4621A] transition-colors">
                  Golden Residency Visas
                </Link>
              </li>
              <li>
                <Link href="/services/visa" className="hover:text-[#D4621A] transition-colors">
                  Family Visa Sponsorship
                </Link>
              </li>
              <li>
                <Link href="/services/visa" className="hover:text-[#D4621A] transition-colors">
                  Degree & Document Attestation
                </Link>
              </li>
              <li>
                <Link href="/services/visa" className="hover:text-[#D4621A] transition-colors">
                  Employment Visa Clearance
                </Link>
              </li>
              <li>
                <Link href="/services/visa" className="hover:text-[#2A1A0E] font-semibold text-[#D4621A] transition-colors">
                  View All 11 Services →
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: International Jobs Branch */}
          <div>
            <h4 className="text-sm font-bold tracking-wider uppercase text-[#2A1A0E] mb-4">
              International Jobs
            </h4>
            <ul className="space-y-2.5 text-xs text-[rgba(42,26,14,0.55)]">
              <li>
                <Link href="/services/jobs" className="hover:text-[#D4621A] transition-colors">
                  Job Assistance Process
                </Link>
              </li>
              <li>
                <Link href="/services/jobs" className="hover:text-[#D4621A] transition-colors">
                  Candidate Qualification Review
                </Link>
              </li>
              <li>
                <Link href="/services/jobs" className="hover:text-[#D4621A] transition-colors">
                  Sample Vacancies (Demo)
                </Link>
              </li>
              <li>
                <Link href="/services/jobs" className="hover:text-[#D4621A] transition-colors">
                  Submit Career Inquiry
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Company Info */}
          <div>
            <h4 className="text-sm font-bold tracking-wider uppercase text-[#2A1A0E] mb-4">
              Contact & Location
            </h4>
            <ul className="space-y-3 text-xs text-[rgba(42,26,14,0.55)]">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0 text-[#D4621A] mt-0.5" />
                <span>{siteConfig.physicalAddress}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0 text-[#D4621A]" />
                <span>{siteConfig.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0 text-[#D4621A]" />
                <span>{siteConfig.email}</span>
              </li>
              <li className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 flex-shrink-0 text-[#2A1A0E]" />
                <span>{siteConfig.whatsAppNumber}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[rgba(42,26,14,0.12)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[rgba(42,26,14,0.55)]">
          <p>© <CopyrightYear /> {siteConfig.companyName}. Fictional Demo Build.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:underline hover:text-[#2A1A0E]">
              Privacy Policy & Terms
            </Link>
            <Link href="/contact" className="hover:underline hover:text-[#2A1A0E]">
              Contact Support
            </Link>
            <Link href="/admin/login" className="hover:underline text-[#D4621A] font-bold">
              Admin Access
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
