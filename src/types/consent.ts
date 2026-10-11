/**
 * Consent and Data Subject Request Types
 * Source: architecture.md §2, security.md §5
 */

export interface ConsentRecord {
  id: string;
  visitorId: string;
  consentType: "essential" | "analytics";
  granted: boolean;
  grantedAt: string;
  revokedAt?: string | null;
}

export interface DataSubjectRequest {
  id: string;
  requestType: "access" | "deletion" | "correction" | "portability";
  requesterEmail: string;
  status: "received" | "in_progress" | "completed" | "denied";
  notes?: string | null;
  createdAt: string;
  completedAt?: string | null;
}
