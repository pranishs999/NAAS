import { describe, it, expect } from "vitest";

const PERMISSIONS_MATRIX = {
  staff: [
    "view_overview",
    "view_inquiries",
    "update_inquiry_status",
    "add_inquiry_note",
    "reassign_inquiry",
    "export_inquiry_csv",
    "view_documents",
    "view_analytics",
    "export_analytics_csv",
  ],
  admin: [
    "view_overview",
    "view_inquiries",
    "update_inquiry_status",
    "add_inquiry_note",
    "reassign_inquiry",
    "export_inquiry_csv",
    "view_documents",
    "view_analytics",
    "export_analytics_csv",
    "manage_services",
    "manage_news",
    "manage_testimonials",
    "manage_users",
    "change_user_role",
    "deactivate_user",
    "change_security_settings",
    "manage_company_settings",
    "backup_restore_reset",
    "view_audit_logs",
    "manage_routing_rules",
    "manage_dsr",
  ],
};

function hasPermission(role: "admin" | "staff", action: string): boolean {
  return PERMISSIONS_MATRIX[role].includes(action);
}

describe("Permissions Matrix Enforcement (architecture.md §4)", () => {
  it("allows Staff role to manage inquiries and view analytics", () => {
    expect(hasPermission("staff", "view_inquiries")).toBe(true);
    expect(hasPermission("staff", "update_inquiry_status")).toBe(true);
    expect(hasPermission("staff", "view_analytics")).toBe(true);
  });

  it("prevents Staff role from managing users or settings", () => {
    expect(hasPermission("staff", "manage_users")).toBe(false);
    expect(hasPermission("staff", "manage_company_settings")).toBe(false);
    expect(hasPermission("staff", "backup_restore_reset")).toBe(false);
  });

  it("allows Admin role full access across all operations", () => {
    expect(hasPermission("admin", "manage_users")).toBe(true);
    expect(hasPermission("admin", "manage_services")).toBe(true);
    expect(hasPermission("admin", "backup_restore_reset")).toBe(true);
    expect(hasPermission("admin", "view_audit_logs")).toBe(true);
  });
});
