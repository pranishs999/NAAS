"use client";

import React, { useState, useEffect } from "react";
import { Users, Plus, ShieldAlert, UserCheck, UserX, Lock } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ReauthModal } from "@/components/admin/ReauthModal";
import { getUsers, createUser, updateUser } from "@/lib/data/demoStore";
import { User, UserRole } from "@/types";

export default function AdminUsersPage(): React.JSX.Element {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [currentRole, setCurrentRole] = useState<UserRole>("admin");
  const [currentUserName, setCurrentUserName] = useState("System Admin (Demo)");

  // Form State
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("staff");

  // Reauth Modal State
  const [reauthAction, setReauthAction] = useState<{
    type: "role_change" | "deactivate";
    user: User;
    newRole?: UserRole;
  } | null>(null);

  useEffect(() => {
    setUsers(getUsers());
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setCurrentRole(data.user.role);
          setCurrentUserName(data.user.name);
        }
      })
      .catch(() => {});
  }, []);

  const handleCreateUser = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    createUser({
      name,
      email,
      role,
      isActive: true,
    });

    setUsers(getUsers());
    setIsCreating(false);
    setName("");
    setEmail("");
  };

  const requestRoleChange = (u: User, newRole: UserRole): void => {
    setReauthAction({ type: "role_change", user: u, newRole });
  };

  const requestToggleActive = (u: User): void => {
    setReauthAction({ type: "deactivate", user: u });
  };

  const executeReauthAction = (): void => {
    if (!reauthAction) return;

    if (reauthAction.type === "role_change" && reauthAction.newRole) {
      updateUser(reauthAction.user.id, { role: reauthAction.newRole });
    } else if (reauthAction.type === "deactivate") {
      updateUser(reauthAction.user.id, { isActive: !reauthAction.user.isActive });
    }

    setUsers(getUsers());
    setReauthAction(null);
  };

  const handleLogout = async (): Promise<void> => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  return (
    <div className="min-h-screen flex bg-[var(--bg-secondary)]">
      <AdminSidebar
        userRole={currentRole}
        userName={currentUserName}
        onLogout={handleLogout}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onToggleMobile={() => setMobileOpen(true)} title="User Management & Roles" />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1">
          {/* NON-PRODUCTION WARNING BANNER (Q82) */}
          <div className="p-4 bg-[var(--action-orange)]/10 border border-[var(--action-orange)]/20 rounded-2xl text-xs text-[var(--action-orange)] space-y-1">
            <div className="flex items-center gap-2 font-bold text-[var(--action-orange)]">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>Non-Production Security Warning</span>
            </div>
            <p className="leading-relaxed">
              Role permissions in this demo are simulated. Production requires server-side RBAC enforced by a real database & auth provider [Q86].
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Admin & Staff Accounts</h2>
              <p className="text-xs text-[var(--text-secondary)]">Manage system access roles (Admin vs Staff).</p>
            </div>
            <button
              onClick={() => setIsCreating(true)}
              className="px-4 py-2 bg-[var(--action-orange)] text-white text-xs font-bold rounded-xl hover:opacity-90 inline-flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" /> Add New User
            </button>
          </div>

          {/* Create User Form */}
          {isCreating && (
            <div className="p-6 bg-[var(--bg-primary)] border-2 border-[var(--action-orange)] rounded-2xl shadow-xl space-y-4">
              <h3 className="text-base font-bold text-[var(--text-primary)]">Add Staff / Admin User</h3>

              <form onSubmit={handleCreateUser} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Jane Doe"
                      className="w-full px-3 py-2 text-xs bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-xl text-[var(--text-primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@hbs.demo"
                      className="w-full px-3 py-2 text-xs bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-xl text-[var(--text-primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Assigned Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="w-full px-3 py-2 text-xs bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-xl text-[var(--text-primary)] font-bold"
                    >
                      <option value="staff">Staff (Inquiries & Analytics only)</option>
                      <option value="admin">Admin (Full Control)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="px-4 py-2 text-xs font-semibold border border-[var(--color-border)] rounded-xl hover:bg-[var(--bg-secondary)]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-[var(--action-orange)] rounded-xl hover:opacity-90"
                  >
                    Create User Account
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Users Table */}
          <div className="p-6 bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-2xl shadow-xs overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-[var(--text-secondary)] uppercase tracking-wider">
                  <th className="py-3 px-3">Name</th>
                  <th className="py-3 px-3">Email</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Re-Auth Protected Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)] text-[var(--text-primary)]">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-[var(--bg-secondary)]/50 transition-colors">
                    <td className="py-3.5 px-3 font-bold text-[var(--text-primary)]">{u.name}</td>
                    <td className="py-3.5 px-3 font-mono text-[var(--text-secondary)]">{u.email}</td>
                    <td className="py-3.5 px-3">
                      <select
                        value={u.role}
                        onChange={(e) => requestRoleChange(u, e.target.value as UserRole)}
                        className="px-2 py-1 bg-[var(--bg-secondary)] border border-[var(--color-border)] rounded-lg text-xs font-bold"
                      >
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-3">
                      {u.isActive ? (
                        <span className="text-[var(--color-success)] font-semibold flex items-center gap-1">
                          <UserCheck className="w-4 h-4" /> Active
                        </span>
                      ) : (
                        <span className="text-[var(--color-error)] font-semibold flex items-center gap-1">
                          <UserX className="w-4 h-4" /> Deactivated
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3">
                      <button
                        onClick={() => requestToggleActive(u)}
                        className="px-3 py-1 text-[11px] font-bold border border-[var(--color-border)] rounded-lg hover:bg-[var(--bg-secondary)] flex items-center gap-1"
                      >
                        <Lock className="w-3 h-3 text-[var(--color-error)]" />
                        {u.isActive ? "Deactivate Account" : "Re-activate Account"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Re-Auth Verification Modal (Q89) */}
      <ReauthModal
        isOpen={!!reauthAction}
        actionTitle={
          reauthAction?.type === "role_change"
            ? `Change role for ${reauthAction.user.name} to ${reauthAction.newRole}`
            : `${reauthAction?.user.isActive ? "Deactivate" : "Activate"} user ${reauthAction?.user.name}`
        }
        actionDescription="This sensitive security operation requires password verification per security policy."
        onSuccess={executeReauthAction}
        onCancel={() => setReauthAction(null)}
      />
    </div>
  );
}
