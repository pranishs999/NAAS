"use client";

import React, { useState } from "react";
import { Search, FileCheck, ShieldCheck } from "lucide-react";
import { getServices } from "@/lib/data/demoStore";
import { ServiceCard } from "@/components/shared/ServiceCard";
import { ServiceModal } from "@/components/shared/ServiceModal";
import { Service } from "@/types";

export default function VisaServicesPage(): React.JSX.Element {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const allServices = getServices().filter((s) => s.category === "visa" && s.published);

  const filteredServices = allServices.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 text-xs font-bold uppercase tracking-wider bg-[#F4AE52]/20 text-[#D4621A] border border-[#F4AE52]/40 rounded-full">
          <FileCheck className="w-4 h-4 text-[#D4621A]" />
          <span>Branch 01 — Documentation & Visa</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-[var(--text-primary)] tracking-tight">
          UAE Residency & Government Attestation Services
        </h1>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          Comprehensive documentation clearance across all 11 specialized government categories in Dubai and the UAE.
        </p>
      </div>

      {/* Search Bar & Filter */}
      <div className="max-w-xl mx-auto relative">
        <Search className="w-5 h-5 absolute left-4 top-3.5 text-[var(--text-secondary)]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search all 11 visa & documentation services..."
          className="w-full pl-12 pr-4 py-3.5 text-sm bg-white border border-[var(--color-border)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#D4621A] text-[var(--text-primary)] shadow-sm"
        />
      </div>

      {/* All 11 Services Grid */}
      <div>
        <div className="flex items-center justify-between mb-6 text-xs text-[var(--text-secondary)] font-medium">
          <span>Showing {filteredServices.length} of {allServices.length} Services</span>
          <span className="flex items-center gap-1 text-[#2A1A0E] font-semibold">
            <ShieldCheck className="w-4 h-4" /> All 11 Services Admin-Configurable
          </span>
        </div>

        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                featured={service.featured}
                onSelect={(s) => setSelectedService(s)}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center border-2 border-dashed border-[var(--color-border)] rounded-2xl">
            <p className="text-sm text-[var(--text-secondary)]">No services found matching &ldquo;{searchQuery}&rdquo;.</p>
          </div>
        )}
      </div>

      {/* Service Modal Popup */}
      <ServiceModal
        service={selectedService}
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
      />
    </div>
  );
}
