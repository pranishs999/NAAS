/**
 * Routing Rule Types
 * Source: architecture.md §2 line 231
 */

export interface RoutingRule {
  id: string;
  branch: "visa" | "jobs" | "all";
  serviceCategory?: string | null;
  assigneeId: string;
  assigneeName: string;
  priority: number;
  isActive: boolean;
}
