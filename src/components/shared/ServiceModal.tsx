"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { Service } from "@/types";
import { MultiStepForm } from "@/components/forms/MultiStepForm";

interface ServiceModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ServiceModal({ service, isOpen, onClose }: ServiceModalProps): React.JSX.Element | null {
  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (e: KeyboardEvent): void => {
        if (e.key === "Escape") onClose();
      };
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "unset";
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen || !service) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="service-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto"
    >
      <div className="w-full max-w-2xl bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-2xl shadow-2xl overflow-hidden my-8 animate-in zoom-in-95">
        {/* Header */}
        <div className="p-6 bg-[var(--bg-secondary)] border-b border-[var(--color-border)] flex items-start justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent-gold)]">
              {service.category === "visa" ? "Documentation & Visa Branch" : "International Jobs Branch"}
            </span>
            <h3 id="service-modal-title" className="text-xl font-black text-[var(--text-primary)] mt-1">
              {service.name}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">{service.description}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          <MultiStepForm
            initialBranch={service.category}
            preselectedServiceId={service.id}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}
