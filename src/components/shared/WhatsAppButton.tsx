import React from "react";
import { MessageSquare } from "lucide-react";
import { siteConfig } from "@/config/siteConfig";

interface WhatsAppButtonProps {
  variant?: "floating" | "contextual" | "followup";
  message?: string;
  referenceCode?: string;
  label?: string;
  className?: string;
}

export function WhatsAppButton({
  variant = "contextual",
  message,
  referenceCode,
  label,
  className = "",
}: WhatsAppButtonProps): React.JSX.Element {
  const number = siteConfig.whatsAppNumber.includes("CLIENT INPUT REQUIRED")
    ? "+97140000000"
    : siteConfig.whatsAppNumber.replace(/[^0-9+]/g, "");

  const defaultMsg = referenceCode
    ? `Hello Horizon Business Services, I am following up on my inquiry (Reference Code: ${referenceCode}).`
    : "Hello Horizon Business Services, I have an inquiry regarding your services.";

  const textToUse = message || defaultMsg;
  const encodedText = encodeURIComponent(textToUse);
  const href = `https://wa.me/${number.replace("+", "")}?text=${encodedText}`;

  if (variant === "floating") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact Horizon Business Services on WhatsApp (opens in new window)"
        className={`fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-[#2A1A0E] hover:bg-[#2A1A0E]/90 text-[#F4AE52] rounded-full shadow-2xl transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#F4AE52] ${className}`}
      >
        <MessageSquare className="w-6 h-6 fill-current" />
        <span className="hidden sm:inline font-semibold text-sm">Chat on WhatsApp</span>
      </a>
    );
  }

  if (variant === "followup") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#2A1A0E] hover:bg-[#2A1A0E]/90 text-[#F4AE52] font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#F4AE52] ${className}`}
      >
        <MessageSquare className="w-5 h-5 fill-current" />
        <span>{label || "Follow Up on WhatsApp"}</span>
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 px-4 py-2 bg-[#2A1A0E]/10 hover:bg-[#2A1A0E]/15 text-[#2A1A0E] font-medium text-xs rounded-lg transition-colors border border-[#2A1A0E]/15 ${className}`}
    >
      <MessageSquare className="w-4 h-4 fill-current" />
      <span>{label || "WhatsApp Quick Inquiry"}</span>
    </a>
  );
}
