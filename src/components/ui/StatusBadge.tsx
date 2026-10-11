import React from "react";
import { InquiryStatus } from "@/types";

interface StatusBadgeProps {
  status: InquiryStatus;
  variant?: "pill" | "dot";
  className?: string;
}

const statusConfig: Record<InquiryStatus, { label: string; bg: string; text: string; dot: string }> = {
  new: { label: "New", bg: "bg-[#FEF3E2] border border-[rgba(42,26,14,0.12)]", text: "text-[#D4621A]", dot: "bg-[#D4621A]" },
  in_review: { label: "In Review", bg: "bg-[#FEF3E2]", text: "text-[#D4621A]", dot: "bg-[#F4AE52]" },
  contacted: { label: "Contacted", bg: "bg-[#FEF3E2]", text: "text-[#2A1A0E]", dot: "bg-[#D4621A]" },
  processing: { label: "Processing", bg: "bg-[#FEF3E2] border border-[rgba(42,26,14,0.12)]", text: "text-[#2A1A0E]", dot: "bg-[#D4621A]" },
  completed: { label: "Completed", bg: "bg-[#FEF3E2]", text: "text-[#2A1A0E]", dot: "bg-[#2A1A0E]" },
  cancelled: { label: "Cancelled", bg: "bg-[#FEF3E2]", text: "text-[#D4621A]", dot: "bg-[#D4621A]" },
};

export function StatusBadge({ status, variant = "pill", className = "" }: StatusBadgeProps): React.JSX.Element {
  const config = statusConfig[status] || {
    label: status,
    bg: "bg-[#FEF3E2]",
    text: "text-[#2A1A0E]",
    dot: "bg-[#D4621A]",
  };

  if (variant === "dot") {
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${config.text} ${className}`}>
        <span className={`w-2 h-2 rounded-full ${config.dot}`} />
        {config.label}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.bg} ${config.text} ${className}`}
    >
      {config.label}
    </span>
  );
}
