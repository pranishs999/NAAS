"use client";

import React from "react";
import * as Icons from "lucide-react";
import { Service } from "@/types";

interface ServiceCardProps {
  service: Service;
  onSelect: (service: Service) => void;
  featured?: boolean;
}

export function ServiceCard({ service, onSelect, featured = false }: ServiceCardProps): React.JSX.Element {
  const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[service.icon] || Icons.FileCheck;

  return (
    <div
      onClick={() => onSelect(service)}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(service);
        }
      }}
      aria-label={`Inquire about ${service.name}`}
      className={`group relative p-6 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#D4621A] ${
        featured
          ? "bg-[#FFFFFF] border-2 border-[#D4621A]/30 hover:border-[#D4621A]"
          : "bg-[#FFFFFF] border border-[rgba(42,26,14,0.12)] hover:border-[#F4AE52]"
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-[#FEF3E2] text-[#D4621A] flex items-center justify-center transition-transform group-hover:scale-105 border border-[rgba(42,26,14,0.12)]">
            <IconComponent className="w-6 h-6" />
          </div>
          {service.featured && (
            <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#D4621A]/10 text-[#D4621A] rounded-full border border-[#D4621A]/20">
              Featured
            </span>
          )}
        </div>

        <h4 className="text-base font-bold text-[#2A1A0E] group-hover:text-[#D4621A] transition-colors line-clamp-2">
          {service.name}
        </h4>

        <p className="mt-2 text-xs text-[rgba(42,26,14,0.55)] leading-relaxed line-clamp-3">
          {service.description}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-[rgba(42,26,14,0.12)] flex items-center justify-between text-xs font-bold text-[#D4621A]">
        <span>Inquire Now</span>
        <span className="transition-transform group-hover:translate-x-1">→</span>
      </div>
    </div>
  );
}
