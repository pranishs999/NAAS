"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, CheckCircle2, XCircle, ArrowUpDown, FileCheck } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { getServices, createService, updateService, deleteService, saveServices } from "@/lib/data/demoStore";
import { Service, UserRole } from "@/types";

export default function AdminServicesPage(): React.JSX.Element {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>("admin");
  const [userName, setUserName] = useState("System Admin (Demo)");

  // Form State
  const [name, setName] = useState("");
  const [category, setCategory] = useState<"visa" | "jobs">("visa");
  const [icon, setIcon] = useState("FileCheck");
  const [description, setDescription] = useState("");
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(true);

  useEffect(() => {
    setServices(getServices());
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
    setEditingService(null);
    setName("");
    setCategory("visa");
    setIcon("FileCheck");
    setDescription("");
    setFeatured(false);
    setPublished(true);
    setIsCreating(true);
  };

  const handleStartEdit = (service: Service): void => {
    setIsCreating(false);
    setEditingService(service);
    setName(service.name);
    setCategory(service.category);
    setIcon(service.icon);
    setDescription(service.description);
    setFeatured(service.featured);
    setPublished(service.published);
  };

  const handleSave = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!name.trim()) return;

    if (isCreating) {
      createService({
        name,
        category,
        icon,
        description,
        featured,
        order: services.length + 1,
        published,
      });
    } else if (editingService) {
      updateService(editingService.id, {
        name,
        category,
        icon,
        description,
        featured,
        published,
      });
    }

    setServices(getServices());
    setIsCreating(false);
    setEditingService(null);
  };

  const handleDelete = (id: string): void => {
    if (confirm("Are you sure you want to delete this service?")) {
      deleteService(id);
      setServices(getServices());
    }
  };

  const handleTogglePublish = (service: Service): void => {
    updateService(service.id, { published: !service.published });
    setServices(getServices());
  };

  const handleMoveOrder = (index: number, direction: "up" | "down"): void => {
    const list = [...services];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;

    const temp = list[index]!;
    list[index] = list[targetIdx]!;
    list[targetIdx] = temp;

    saveServices(list);
    setServices(list);
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
        <AdminHeader onToggleMobile={() => setMobileOpen(true)} title="Services Management" />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1">
          {/* Header Action Bar */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Services Catalog (All 11 Categories)</h2>
              <p className="text-xs text-[var(--text-secondary)]">Configure names, descriptions, featured flags, and display order.</p>
            </div>
            <button
              onClick={handleStartCreate}
              className="px-4 py-2 bg-[var(--action-orange)] text-white text-xs font-bold rounded-xl hover:opacity-90 inline-flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" /> Add New Service
            </button>
          </div>

          {/* Create/Edit Form Modal */}
          {(isCreating || editingService) && (
            <div className="p-6 bg-[var(--bg-primary)] border-2 border-[var(--accent-gold)] rounded-2xl shadow-xl space-y-4 animate-in zoom-in-95">
              <h3 className="text-base font-bold text-[var(--text-primary)]">
                {isCreating ? "Create New Service" : `Edit Service: ${editingService?.name}`}
              </h3>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Service Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Service 1 (CLIENT INPUT REQUIRED)"
                      className="w-full px-3 py-2 text-xs bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-xl text-[var(--text-primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Category Branch</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as "visa" | "jobs")}
                      className="w-full px-3 py-2 text-xs bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-xl text-[var(--text-primary)]"
                    >
                      <option value="visa">Documentation & Visa</option>
                      <option value="jobs">International Jobs</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Description</label>
                  <textarea
                    rows={2}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter detailed service description..."
                    className="w-full p-3 text-xs bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-xl text-[var(--text-primary)]"
                  />
                </div>

                <div className="flex items-center gap-6 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="w-4 h-4 rounded text-[var(--action-orange)]"
                    />
                    <span className="font-semibold text-[var(--text-primary)]">Feature on Homepage</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={published}
                      onChange={(e) => setPublished(e.target.checked)}
                      className="w-4 h-4 rounded text-[var(--color-success)]"
                    />
                    <span className="font-semibold text-[var(--text-primary)]">Publish Service</span>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreating(false);
                      setEditingService(null);
                    }}
                    className="px-4 py-2 text-xs font-semibold border border-[var(--color-border)] rounded-xl hover:bg-[var(--bg-secondary)]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-[var(--action-orange)] rounded-xl hover:opacity-90"
                  >
                    Save Service
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Services List Table */}
          <div className="p-6 bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-2xl shadow-xs overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-[var(--text-secondary)] uppercase tracking-wider">
                  <th className="py-3 px-3">Order</th>
                  <th className="py-3 px-3">Service Name</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Featured</th>
                  <th className="py-3 px-3">Published</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)] text-[var(--text-primary)]">
                {services.map((srv, idx) => (
                  <tr key={srv.id} className="hover:bg-[var(--bg-secondary)]/50 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-[var(--text-secondary)]">{idx + 1}</span>
                        <div className="flex flex-col">
                          <button
                            onClick={() => handleMoveOrder(idx, "up")}
                            disabled={idx === 0}
                            className="p-0.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-20"
                          >
                            ▲
                          </button>
                          <button
                            onClick={() => handleMoveOrder(idx, "down")}
                            disabled={idx === services.length - 1}
                            className="p-0.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-20"
                          >
                            ▼
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-bold text-[var(--text-primary)]">{srv.name}</td>
                    <td className="py-3.5 px-3 capitalize font-semibold">{srv.category}</td>
                    <td className="py-3.5 px-3">
                      {srv.featured ? (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-[var(--action-orange)]/15 text-[var(--action-orange)] rounded">
                          Featured
                        </span>
                      ) : (
                        <span className="text-[var(--text-secondary)]">-</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3">
                      <button
                        onClick={() => handleTogglePublish(srv)}
                        className="flex items-center gap-1 font-semibold"
                      >
                        {srv.published ? (
                          <span className="text-[var(--color-success)] flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Published
                          </span>
                        ) : (
                          <span className="text-[var(--color-error)] flex items-center gap-1">
                            <XCircle className="w-4 h-4" /> Draft
                          </span>
                        )}
                      </button>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleStartEdit(srv)}
                          className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--accent-gold)] border border-[var(--color-border)] rounded-lg"
                          title="Edit Service"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(srv.id)}
                          className="p-1.5 text-[var(--text-secondary)] hover:text-[#D4621A] border border-[var(--color-border)] rounded-lg"
                          title="Delete Service"
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
