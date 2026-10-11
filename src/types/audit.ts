/**
 * Audit Log Entity Types
 * Source: architecture.md §2, security.md §4
 */

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entityType?: string | null;
  entityId?: string | null;
  details?: Record<string, unknown> | null;
  ipAddress?: string | null;
  isDemo: boolean;
  createdAt: string;
}
