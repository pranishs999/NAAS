"use client";

import React, { useState } from "react";
import { User, Mail, Phone, ChevronRight, ChevronLeft, Loader2, Send } from "lucide-react";
import { inquirySchema } from "@/lib/validation/schemas";
import { generateReferenceCode } from "@/lib/utils/referenceCode";
import { createInquiry } from "@/lib/data/demoStore";
import { AttachedDocumentMetadata } from "@/types";
import { FileUpload } from "./FileUpload";
import { ConfirmationCard } from "./ConfirmationCard";
import { getServices } from "@/lib/data/demoStore";

interface MultiStepFormProps {
  initialBranch?: "visa" | "jobs";
  preselectedServiceId?: string;
  onSuccess?: (refCode: string) => void;
  onCancel?: () => void;
}

export function MultiStepForm({
  initialBranch = "visa",
  preselectedServiceId,
  onSuccess,
  onCancel,
}: MultiStepFormProps): React.JSX.Element {
  const [step, setStep] = useState<number>(1);
  const [branch, setBranch] = useState<"visa" | "jobs">(initialBranch);
  const [serviceId, setServiceId] = useState<string>(preselectedServiceId || "");

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [passportNumber, setPassportNumber] = useState("");
  const [nationality, setNationality] = useState("");
  const [qualification, setQualification] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [preferredRole, setPreferredRole] = useState("");
  const [urgency, setUrgency] = useState("Standard");
  const [message, setMessage] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<AttachedDocumentMetadata[]>([]);
  const [honeypot, setHoneypot] = useState(""); // Anti-spam

  // UI States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRefCode, setSubmittedRefCode] = useState<string | null>(null);

  const availableServices = getServices().filter((s) => s.category === branch && s.published);

  // Step Validation
  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!fullName.trim() || fullName.trim().length < 2) {
        newErrors.fullName = "Full name is required (min 2 characters).";
      }
      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = "Please enter a valid email address.";
      }
      if (!phone.trim() || phone.trim().length < 5) {
        newErrors.phone = "Phone number is required.";
      }
    }

    if (currentStep === 2) {
      if (branch === "visa" && availableServices.length > 0 && !serviceId) {
        newErrors.serviceId = "Please select a visa service.";
      }
      if (branch === "jobs") {
        if (!preferredRole.trim()) {
          newErrors.preferredRole = "Preferred role or field is required.";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (): void => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = (): void => {
    setErrors({});
    setStep((prev) => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!validateStep(step)) return;

    // Validate overall schema with Zod
    const payload = {
      branch,
      serviceId: serviceId || undefined,
      fullName,
      email,
      phone,
      message: message || undefined,
      formData: {
        passportNumber: passportNumber || undefined,
        nationality: nationality || undefined,
        qualification: qualification || undefined,
        experienceYears: experienceYears || undefined,
        preferredRole: preferredRole || undefined,
        urgency,
      },
      honeypot: honeypot || undefined,
    };

    const parseResult = inquirySchema.safeParse(payload);
    if (!parseResult.success) {
      const fieldErrors: Record<string, string> = {};
      parseResult.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const refCode = generateReferenceCode(branch);
      const selectedSrv = availableServices.find((s) => s.id === serviceId);

      const created = createInquiry({
        referenceCode: refCode,
        branch,
        serviceId: serviceId || null,
        fullName,
        email,
        phone,
        message,
        formData: {
          serviceName: selectedSrv?.name,
          passportNumber,
          nationality,
          qualification,
          experienceYears,
          preferredRole,
          urgency,
        },
        documents: attachedFiles,
      });

      setIsSubmitting(false);
      setSubmittedRefCode(created.referenceCode);
      if (onSuccess) onSuccess(created.referenceCode);
    }, 600);
  };

  if (submittedRefCode) {
    return (
      <ConfirmationCard
        referenceCode={submittedRefCode}
        branch={branch}
        fullName={fullName}
        email={email}
        onReset={() => {
          setSubmittedRefCode(null);
          setStep(1);
        }}
      />
    );
  }

  return (
    <div className="bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-2xl p-6 md:p-8 shadow-xl">
      {/* Step Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2 text-xs font-semibold text-[var(--text-secondary)]">
          <span>Step {step} of 3</span>
          <span className="capitalize">
            {step === 1 && "Personal Information"}
            {step === 2 && (branch === "visa" ? "Visa Details" : "Job Preference")}
            {step === 3 && "Review & Attachments"}
          </span>
        </div>
        <div className="w-full bg-[var(--bg-secondary)] h-2 rounded-full overflow-hidden">
          <div
            className="bg-[var(--action-orange)] h-full transition-all duration-300 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Anti-spam honeypot hidden input */}
        <input
          type="text"
          name="honeypot"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        {/* STEP 1: Personal Details */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in">
            {/* Branch Selector */}
            <div>
              <label className="block text-xs font-bold text-[var(--text-primary)] mb-2 uppercase tracking-wider">
                Select Service Branch
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setBranch("visa");
                    setServiceId("");
                  }}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                    branch === "visa"
                      ? "border-[var(--accent-gold)] bg-[var(--accent-gold)]/10 text-[var(--text-primary)] ring-2 ring-[var(--accent-gold)]"
                      : "border-[var(--color-border)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
                  }`}
                >
                  Documentation & Visa Services
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBranch("jobs");
                    setServiceId("");
                  }}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                    branch === "jobs"
                      ? "border-[var(--accent-gold)] bg-[var(--accent-gold)]/10 text-[var(--text-primary)] ring-2 ring-[var(--accent-gold)]"
                      : "border-[var(--color-border)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
                  }`}
                >
                  International Job Services
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                Full Name <span className="text-[#D4621A]">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-[var(--text-secondary)]" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-gold)] text-[var(--text-primary)]"
                />
              </div>
              {errors.fullName && <p className="mt-1 text-xs text-[#D4621A]">{errors.fullName}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                  Email Address <span className="text-[#D4621A]">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-[var(--text-secondary)]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-4 py-2.5 text-sm bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-gold)] text-[var(--text-primary)]"
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-[#D4621A]">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                  Phone / WhatsApp <span className="text-[#D4621A]">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-[var(--text-secondary)]" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+971 50 000 0000"
                    className="w-full pl-9 pr-4 py-2.5 text-sm bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-gold)] text-[var(--text-primary)]"
                  />
                </div>
                {errors.phone && <p className="mt-1 text-xs text-[#D4621A]">{errors.phone}</p>}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Branch Specific Details */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in">
            {branch === "visa" ? (
              <>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                    Select Required Service <span className="text-[#D4621A]">*</span>
                  </label>
                  <select
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-gold)] text-[var(--text-primary)]"
                  >
                    <option value="">-- Choose from 11 Services --</option>
                    {availableServices.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  {errors.serviceId && <p className="mt-1 text-xs text-[#D4621A]">{errors.serviceId}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                      Passport Number (Optional)
                    </label>
                    <input
                      type="text"
                      value={passportNumber}
                      onChange={(e) => setPassportNumber(e.target.value)}
                      placeholder="e.g. Z1234567"
                      className="w-full px-3 py-2.5 text-sm bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-gold)] text-[var(--text-primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                      Nationality / Citizenship (Optional)
                    </label>
                    <input
                      type="text"
                      value={nationality}
                      onChange={(e) => setNationality(e.target.value)}
                      placeholder="e.g. Indian, British, etc."
                      className="w-full px-3 py-2.5 text-sm bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-gold)] text-[var(--text-primary)]"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                    Preferred Role / Career Field <span className="text-[#D4621A]">*</span>
                  </label>
                  <input
                    type="text"
                    value={preferredRole}
                    onChange={(e) => setPreferredRole(e.target.value)}
                    placeholder="e.g. Software Engineer, Hospitality, Healthcare"
                    className="w-full px-3 py-2.5 text-sm bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-gold)] text-[var(--text-primary)]"
                  />
                  {errors.preferredRole && <p className="mt-1 text-xs text-[#D4621A]">{errors.preferredRole}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                      Highest Qualification
                    </label>
                    <input
                      type="text"
                      value={qualification}
                      onChange={(e) => setQualification(e.target.value)}
                      placeholder="e.g. Bachelor's Degree"
                      className="w-full px-3 py-2.5 text-sm bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-gold)] text-[var(--text-primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                      Years of Experience
                    </label>
                    <input
                      type="text"
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(e.target.value)}
                      placeholder="e.g. 5 Years"
                      className="w-full px-3 py-2.5 text-sm bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-gold)] text-[var(--text-primary)]"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                Processing Urgency
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-gold)] text-[var(--text-primary)]"
              >
                <option value="Standard">Standard Processing</option>
                <option value="Express">Express / Urgent</option>
                <option value="VIP">VIP Government Liaison</option>
              </select>
            </div>
          </div>
        )}

        {/* STEP 3: Review & Attachments */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                Additional Notes / Special Instructions
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Provide any additional details or background regarding your inquiry..."
                className="w-full p-3 text-sm bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-gold)] text-[var(--text-primary)]"
              />
            </div>

            <FileUpload onFilesChange={(files) => setAttachedFiles(files)} />

            <div className="p-3 bg-[var(--action-orange)]/10 border border-[var(--action-orange)]/20 rounded-xl text-xs text-[var(--action-orange)]">
              <span className="font-bold block mb-0.5">Demo Mode Notice</span>
              Submitting generates a fictional demo inquiry reference code. No real credit card or official government action occurs.
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between gap-4">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold border border-[var(--color-border)] rounded-xl hover:bg-[var(--bg-secondary)] flex items-center gap-1 text-[var(--text-primary)]"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          ) : onCancel ? (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              Cancel
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 text-xs font-bold text-white bg-[var(--action-orange)] hover:opacity-90 rounded-xl flex items-center gap-1.5 shadow-sm"
            >
              Next Step <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 text-xs font-bold text-white bg-[var(--action-orange)] hover:opacity-90 rounded-xl flex items-center gap-2 shadow-md transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Submit Inquiry
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
