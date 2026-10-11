"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, CheckCircle2, XCircle, MessageSquareQuote } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from "@/lib/data/demoStore";
import { Testimonial, UserRole } from "@/types";

export default function AdminTestimonialsPage(): React.JSX.Element {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>("admin");
  const [userName, setUserName] = useState("System Admin (Demo)");

  // Form Fields
  const [clientName, setClientName] = useState("");
  const [role, setRole] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(true);

  useEffect(() => {
    setTestimonials(getTestimonials());
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUserRole(data.user.role);
          setUserName(data.user.name);
        }
      })
      .catch(() => {});
  }, []);

  const handleStartCreate = (): void => {
    setEditingItem(null);
    setClientName("");
    setRole("");
    setContent("");
    setPublished(true);
    setIsCreating(true);
  };

  const handleStartEdit = (t: Testimonial): void => {
    setIsCreating(false);
    setEditingItem(t);
    setClientName(t.clientName);
    setRole(t.role || "");
    setContent(t.content);
    setPublished(t.published);
  };

  const handleSave = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!clientName.trim() || !content.trim()) return;

    if (isCreating) {
      createTestimonial({
        clientName,
        role,
        content,
        order: testimonials.length + 1,
        published,
      });
    } else if (editingItem) {
      updateTestimonial(editingItem.id, {
        clientName,
        role,
        content,
        published,
      });
    }

    setTestimonials(getTestimonials());
    setIsCreating(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string): void => {
    if (confirm("Delete this testimonial entry?")) {
      deleteTestimonial(id);
      setTestimonials(getTestimonials());
    }
  };

  const handleLogout = async (): Promise<void> => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  return (
    <div className="min-h-screen flex bg-[var(--bg-secondary)]">
      <AdminSidebar
        userRole={userRole}
        userName={userName}
        onLogout={handleLogout}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onToggleMobile={() => setMobileOpen(true)} title="Testimonials Management" />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Client Testimonials Catalog</h2>
              <p className="text-xs text-[var(--text-secondary)]">All entries are explicitly labeled as fictional demo data [Q114].</p>
            </div>
            <button
              onClick={handleStartCreate}
              className="px-4 py-2 bg-[#D4621A] text-white text-xs font-bold rounded-xl hover:bg-[#D4621A] inline-flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Testimonial
            </button>
          </div>

          {(isCreating || editingItem) && (
            <div className="p-6 bg-[var(--bg-primary)] border-2 border-[#D4621A] rounded-2xl shadow-xl space-y-4">
              <h3 className="text-base font-bold text-[var(--text-primary)]">
                {isCreating ? "New Testimonial Entry" : `Edit Testimonial: ${editingItem?.clientName}`}
              </h3>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Client Name</label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. Demo Client A (Fictional)"
                      className="w-full px-3 py-2 text-xs bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-xl text-[var(--text-primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Role / Designation</label>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g. Business Sponsor"
                      className="w-full px-3 py-2 text-xs bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-xl text-[var(--text-primary)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Testimonial Content</label>
                  <textarea
                    rows={3}
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter testimonial content..."
                    className="w-full p-3 text-xs bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-xl text-[var(--text-primary)]"
                  />
                </div>

                <div className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="w-4 h-4 rounded accent-[#D4621A]"
                  />
                  <span className="font-semibold text-[var(--text-primary)]">Publish Testimonial</span>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreating(false);
                      setEditingItem(null);
                    }}
                    className="px-4 py-2 text-xs font-semibold border border-[var(--color-border)] rounded-xl hover:bg-[var(--bg-secondary)]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-[#D4621A] rounded-xl hover:bg-[#D4621A] transition-colors"
                  >
                    Save Entry
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="p-6 bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-2xl shadow-xs overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-[var(--text-secondary)] uppercase tracking-wider">
                  <th className="py-3 px-3">Client Name</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Content Excerpt</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 font-bold text-[#D4621A]">Demo Label</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)] text-[var(--text-primary)]">
                {testimonials.map((t) => (
                  <tr key={t.id} className="hover:bg-[var(--bg-secondary)]/50 transition-colors">
                    <td className="py-3.5 px-3 font-bold text-[var(--text-primary)]">{t.clientName}</td>
                    <td className="py-3.5 px-3">{t.role || "-"}</td>
                    <td className="py-3.5 px-3 max-w-xs truncate text-[var(--text-secondary)]">{t.content}</td>
                    <td className="py-3.5 px-3">
                      {t.published ? (
                        <span className="text-[#2A1A0E] font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Published
                        </span>
                      ) : (
                        <span className="text-[#D4621A] font-semibold flex items-center gap-1">
                          <XCircle className="w-4 h-4" /> Draft
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-[#F4AE52]/20 text-[#D4621A] border border-[#F4AE52]/40 rounded">
                        FICTIONAL DEMO
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleStartEdit(t)}
                          className="p-1.5 text-[var(--text-secondary)] hover:text-[#D4621A] border border-[var(--color-border)] rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="p-1.5 text-[var(--text-secondary)] hover:text-[#D4621A] border border-[var(--color-border)] rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
