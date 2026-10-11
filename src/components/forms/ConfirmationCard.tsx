import React from "react";
import { CheckCircle2, Copy, FileCheck } from "lucide-react";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";

interface ConfirmationCardProps {
  referenceCode: string;
  branch: "visa" | "jobs";
  fullName: string;
  email: string;
  onReset?: () => void;
}

export function ConfirmationCard({
  referenceCode,
  branch,
  fullName,
  email,
  onReset,
}: ConfirmationCardProps): React.JSX.Element {
  const [copied, setCopied] = React.useState(false);

  const copyCode = (): void => {
    navigator.clipboard.writeText(referenceCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-2xl shadow-xl text-center space-y-6 animate-in zoom-in-95">
      <div className="w-16 h-16 mx-auto rounded-full bg-[var(--color-success)]/10 text-[var(--color-success)] flex items-center justify-center">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div>
        <span className="inline-block px-2.5 py-1 mb-2 text-[10px] font-bold uppercase tracking-wider bg-[var(--action-orange)]/15 text-[var(--action-orange)] rounded-md">
          Demo Inquiry Recorded
        </span>
        <h3 className="text-2xl font-black text-[var(--text-primary)]">Inquiry Received Successfully!</h3>
        <p className="mt-2 text-sm text-[var(--text-secondary)] max-w-md mx-auto">
          Thank you, <span className="font-semibold text-[var(--text-primary)]">{fullName}</span>. Your {branch === "visa" ? "Documentation & Visa" : "International Job"} inquiry has been registered in the demo system. A confirmation has been logged for <span className="font-semibold">{email}</span>.
        </p>
      </div>

      {/* Reference Code Display */}
      <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--color-border)] rounded-xl max-w-sm mx-auto flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] block">
            Reference Code (PROVISIONAL)
          </span>
          <span className="font-mono font-extrabold text-xl text-[var(--action-orange)]">
            {referenceCode}
          </span>
        </div>
        <button
          onClick={copyCode}
          className="p-2 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--color-border)] rounded-lg hover:bg-[var(--bg-primary)] flex items-center gap-1 transition-colors"
          title="Copy reference code"
        >
          <Copy className="w-4 h-4" />
          <span>{copied ? "Copied!" : "Copy"}</span>
        </button>
      </div>

      {/* WhatsApp Follow-Up CTA */}
      <div className="pt-2">
        <p className="text-xs text-[var(--text-secondary)] mb-3">
          For fast follow-up with our support team, click below to open WhatsApp with your reference code prefilled:
        </p>
        <WhatsAppButton
          variant="followup"
          referenceCode={referenceCode}
          label="Follow Up on WhatsApp with Reference Code"
        />
      </div>

      {onReset && (
        <div className="pt-4 border-t border-[var(--color-border)]">
          <button
            onClick={onReset}
            className="text-xs font-semibold text-[var(--accent-gold)] hover:underline inline-flex items-center gap-1"
          >
            <FileCheck className="w-4 h-4" /> Submit Another Inquiry
          </button>
        </div>
      )}
    </div>
  );
}
