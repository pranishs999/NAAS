/**
 * Inquiry & Timeline Types
 * Source: architecture.md §2, context.md §3
 */

export type InquiryBranch = "visa" | "jobs";
export type InquiryPriority = "low" | "medium" | "high";
export type InquiryStatus = "new" | "in_review" | "contacted" | "processing" | "completed" | "cancelled";

export interface InquiryFormData {
  serviceId?: string;
  serviceName?: string;
  passportNumber?: string;
  nationality?: string;
  currentLocation?: string;
  qualification?: string;
  experienceYears?: string;
  preferredRole?: string;
  urgency?: string;
  additionalNotes?: string;
}

export interface Inquiry {
  id: string;
  referenceCode: string; // e.g. HBS-VIS-0001 or HBS-JOB-0001 (PROVISIONAL)
  branch: InquiryBranch;
  serviceId?: string | null;
  status: InquiryStatus;
  priority: InquiryPriority;
  assigneeId?: string | null;
  assigneeName?: string | null;
  fullName: string;
  email: string;
  phone?: string;
  message?: string;
  formData?: InquiryFormData;
  documents?: AttachedDocumentMetadata[];
  firstResponseAt?: string | null;
  createdAt: string;
  updatedAt: string;
  isDemo: boolean;
}

export interface AttachedDocumentMetadata {
  id: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  uploadedAt: string;
  storageUrl?: string; // base64 or blob URL in demo
}

export interface InquiryNote {
  id: string;
  inquiryId: string;
  authorId: string;
  authorName: string;
  content: string;
  type: "internal" | "status_change" | "communication";
  createdAt: string;
}

export interface StatusEvent {
  id: string;
  inquiryId: string;
  fromStatus: string | null;
  toStatus: string;
  changedById: string;
  changedByName: string;
  changedAt: string;
}
