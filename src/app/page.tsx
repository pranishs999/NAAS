"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FileCheck, Briefcase, ArrowRight, ShieldCheck, Award, Users2, Star, CheckCircle } from "lucide-react";
import { getServices, getTestimonials } from "@/lib/data/demoStore";
import { ServiceCard } from "@/components/shared/ServiceCard";
import { ServiceModal } from "@/components/shared/ServiceModal";
import { Service } from "@/types";

export default function HomePage(): React.JSX.Element {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const services = getServices();
  const featuredServices = services.filter((s) => s.featured && s.published);
  const testimonials = getTestimonials().filter((t) => t.published);

  return (
    <div className="space-y-20 pb-20 bg-[#FEF3E2]">
      {/* HERO WELCOME SECTION with Mashrabiya Geometric Pattern & Warm Dubai Tone */}
      <section className="relative bg-[#FEF3E2] border-b border-[rgba(42,26,14,0.12)] pt-20 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 mashrabiya-pattern pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FEF3E2] border border-[rgba(42,26,14,0.12)] text-xs font-semibold text-[#D4621A]">
            <ShieldCheck className="w-4 h-4 text-[#D4621A]" />
            <span>UAE Government Liaison & Global Job Guidance</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-tight max-w-4xl mx-auto text-[#2A1A0E]">
            Your Trusted Gateway to <span className="font-extrabold text-[#D4621A]">UAE Residency</span> & International Opportunities
          </h1>

          <p className="text-base sm:text-lg text-[rgba(42,26,14,0.55)] max-w-2xl mx-auto leading-relaxed">
            Horizon Business Services delivers end-to-end documentation, visa attestation, and career placement services under one unified brand.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/services/visa"
              className="px-6 py-3.5 bg-[#D4621A] hover:opacity-90 text-white font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              Explore Visa Services <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/services/jobs"
              className="px-6 py-3.5 bg-[#2A1A0E] hover:bg-[#D4621A] text-white font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              Browse Job Assistance
            </Link>
          </div>
        </div>
      </section>

      {/* TWO EQUAL BRANCH CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Branch 1 Card */}
          <div className="p-8 bg-[#FFFFFF] border-2 border-[#D4621A]/30 rounded-3xl shadow-sm flex flex-col justify-between hover:border-[#D4621A] transition-all group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#FEF3E2] text-[#D4621A] border border-[rgba(42,26,14,0.12)] flex items-center justify-center mb-6">
                <FileCheck className="w-8 h-8" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4621A]">
                Branch 01
              </span>
              <h2 className="text-2xl font-bold text-[#2A1A0E] mt-1 mb-3">
                Documentation & Visa Services
              </h2>
              <p className="text-sm text-[rgba(42,26,14,0.55)] leading-relaxed mb-6">
                Professional handling of Golden Residency Visas, family sponsorships, trade license renewals, degree attestations, and Public Relations Officer (PRO) government liaisons.
              </p>
              <ul className="space-y-2 text-xs font-semibold text-[#2A1A0E] mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#2A1A0E]" />
                  <span>11 Specialized Documentation Categories</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#2A1A0E]" />
                  <span>Direct UAE Ministry & Embassy Attestation</span>
                </li>
              </ul>
            </div>
            <Link
              href="/services/visa"
              className="w-full py-3.5 bg-[#2A1A0E] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 group-hover:bg-[#D4621A] transition-colors"
            >
              Access Visa & Documentation Branch →
            </Link>
          </div>

          {/* Branch 2 Card */}
          <div className="p-8 bg-[#FFFFFF] border-2 border-[rgba(42,26,14,0.12)] rounded-3xl shadow-sm flex flex-col justify-between hover:border-[#F4AE52] transition-all group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#FEF3E2] text-[#F4AE52] border border-[rgba(42,26,14,0.12)] flex items-center justify-center mb-6">
                <Briefcase className="w-8 h-8" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4621A]">
                Branch 02
              </span>
              <h2 className="text-2xl font-bold text-[#2A1A0E] mt-1 mb-3">
                International Job Services
              </h2>
              <p className="text-sm text-[rgba(42,26,14,0.55)] leading-relaxed mb-6">
                Process-driven international employment guidance, qualification verification, document preparation, and sample vacancy reviews for overseas candidates.
              </p>
              <ul className="space-y-2 text-xs font-semibold text-[#2A1A0E] mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#2A1A0E]" />
                  <span>Structured Candidate Placement Process</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#2A1A0E]" />
                  <span>Fictional Demo Vacancy Tracking</span>
                </li>
              </ul>
            </div>
            <Link
              href="/services/jobs"
              className="w-full py-3.5 bg-[#2A1A0E] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 group-hover:bg-[#D4621A] transition-colors"
            >
              Access International Job Branch →
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED SERVICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#D4621A]">
              Core Capabilities
            </span>
            <h3 className="text-3xl font-light text-[#2A1A0E] mt-1"><span className="font-bold">Featured</span> Services</h3>
          </div>
          <Link
            href="/services/visa"
            className="text-xs font-bold text-[#D4621A] hover:underline flex items-center gap-1"
          >
            View All 11 Services →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              featured={service.featured}
              onSelect={(s) => setSelectedService(s)}
            />
          ))}
        </div>
      </section>

      {/* TRUST ELEMENTS SECTION */}
      <section className="bg-[#FEF3E2] py-16 border-y border-[rgba(42,26,14,0.12)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D4621A]">
              Transparency & Quality
            </span>
            <h3 className="text-3xl font-light text-[#2A1A0E] mt-1"><span className="font-bold">Built on Trust</span> & Integrity</h3>
            <p className="text-xs text-[rgba(42,26,14,0.55)] mt-2">
              We provide transparent documentation workflows, clear milestone tracking, and honest demo evaluation standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-[#FFFFFF] border border-[rgba(42,26,14,0.12)] rounded-2xl shadow-xs">
              <div className="w-12 h-12 mx-auto rounded-xl bg-[#FEF3E2] text-[#D4621A] flex items-center justify-center mb-4 border border-[rgba(42,26,14,0.12)]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-[#2A1A0E]">Transparent Process</h4>
              <p className="text-xs text-[rgba(42,26,14,0.55)] mt-2 leading-relaxed">
                Clear documentation checklists, straightforward timeline expectations, and no hidden clearance fees.
              </p>
            </div>

            <div className="p-6 bg-[#FFFFFF] border border-[rgba(42,26,14,0.12)] rounded-2xl shadow-xs">
              <div className="w-12 h-12 mx-auto rounded-xl bg-[#FEF3E2] text-[#D4621A] flex items-center justify-center mb-4 border border-[rgba(42,26,14,0.12)]">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-[#2A1A0E]">Verified Workflows</h4>
              <p className="text-xs text-[rgba(42,26,14,0.55)] mt-2 leading-relaxed">
                Category-prefixed reference codes ensure every inquiry is systematically tracked and assigned.
              </p>
            </div>

            <div className="p-6 bg-[#FFFFFF] border border-[rgba(42,26,14,0.12)] rounded-2xl shadow-xs">
              <div className="w-12 h-12 mx-auto rounded-xl bg-[#FEF3E2] text-[#2A1A0E] flex items-center justify-center mb-4 border border-[rgba(42,26,14,0.12)]">
                <Users2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-[#2A1A0E]">Dedicated Support</h4>
              <p className="text-xs text-[rgba(42,26,14,0.55)] mt-2 leading-relaxed">
                Direct WhatsApp integration and multi-channel follow-up options for candidates and business sponsors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#D4621A]">
            Client Feedback
          </span>
          <h3 className="text-3xl font-light text-[#2A1A0E] mt-1"><span className="font-bold">What Our Clients</span> Say</h3>
          <span className="inline-block mt-2 px-2.5 py-0.5 text-[10px] font-bold uppercase bg-[#FEF3E2] text-[#D4621A] rounded border border-[rgba(42,26,14,0.12)]">
            Fictional Demo Feedback
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="p-6 bg-[#FFFFFF] border border-[rgba(42,26,14,0.12)] rounded-2xl shadow-xs space-y-4"
            >
              <div className="flex items-center gap-1 text-[#F4AE52]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <blockquote className="text-xs text-[#2A1A0E] leading-relaxed italic">
                &ldquo;{item.content}&rdquo;
              </blockquote>
              <div className="pt-2 border-t border-[rgba(42,26,14,0.12)] flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#2A1A0E] block">{item.clientName}</span>
                  <span className="text-[rgba(42,26,14,0.55)]">{item.role || "Client"}</span>
                </div>
                <span className="text-[10px] font-semibold text-[#D4621A] bg-[#FEF3E2] px-2 py-0.5 rounded">
                  Demo Entry
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICE MODAL POPUP */}
      <ServiceModal
        service={selectedService}
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
      />
    </div>
  );
}
