"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Newspaper, Calendar, CheckCircle2 } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { getNewsArticles, createNewsArticle, updateNewsArticle, deleteNewsArticle } from "@/lib/data/demoStore";
import { NewsArticle, NewsStatus, UserRole } from "@/types";

export default function AdminNewsPage(): React.JSX.Element {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>("admin");
  const [userName, setUserName] = useState("System Admin (Demo)");

  // Form Fields
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("Visa Updates");
  const [status, setStatus] = useState<NewsStatus>("draft");

  useEffect(() => {
    setArticles(getNewsArticles());
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
    setEditingArticle(null);
    setTitle("");
    setExcerpt("");
    setBody("");
    setCategory("Visa Updates");
    setStatus("draft");
    setIsCreating(true);
  };

  const handleStartEdit = (a: NewsArticle): void => {
    setIsCreating(false);
    setEditingArticle(a);
    setTitle(a.title);
    setExcerpt(a.excerpt);
    setBody(a.body);
    setCategory(a.category || "Visa Updates");
    setStatus(a.status);
  };

  const handleSave = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    if (isCreating) {
      createNewsArticle({
        title,
        slug,
        excerpt,
        body,
        category,
        authorName: userName,
        status,
        publishAt: status === "published" ? new Date().toISOString() : undefined,
      });
    } else if (editingArticle) {
      updateNewsArticle(editingArticle.id, {
        title,
        slug,
        excerpt,
        body,
        category,
        status,
        publishAt: status === "published" && !editingArticle.publishAt ? new Date().toISOString() : editingArticle.publishAt,
      });
    }

    setArticles(getNewsArticles());
    setIsCreating(false);
    setEditingArticle(null);
  };

  const handleDelete = (id: string): void => {
    if (confirm("Delete this news article?")) {
      deleteNewsArticle(id);
      setArticles(getNewsArticles());
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
        <AdminHeader onToggleMobile={() => setMobileOpen(true)} title="News & Updates Editorial" />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Editorial Workflow & News Articles</h2>
              <p className="text-xs text-[var(--text-secondary)]">Manage draft, scheduled, published, and archived regulation updates.</p>
            </div>
            <button
              onClick={handleStartCreate}
              className="px-4 py-2 bg-[#D4621A] text-white text-xs font-bold rounded-xl hover:bg-[#D4621A] inline-flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" /> Create Article
            </button>
          </div>

          {(isCreating || editingArticle) && (
            <div className="p-6 bg-[var(--bg-primary)] border-2 border-[#D4621A] rounded-2xl shadow-xl space-y-4">
              <h3 className="text-base font-bold text-[var(--text-primary)]">
                {isCreating ? "New News Article" : `Edit Article: ${editingArticle?.title}`}
              </h3>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Title</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. UAE Visa Regulation Update 2026"
                      className="w-full px-3 py-2 text-xs bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-xl text-[var(--text-primary)]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Category</label>
                      <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="e.g. Visa Updates"
                        className="w-full px-3 py-2 text-xs bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-xl text-[var(--text-primary)]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Editorial Status</label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as NewsStatus)}
                        className="w-full px-3 py-2 text-xs bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-xl text-[var(--text-primary)]"
                      >
                        <option value="draft">Draft</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="published">Published</option>
                        <option value="unpublished">Unpublished</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Excerpt Summary</label>
                  <textarea
                    rows={2}
                    required
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Short summary for card listing..."
                    className="w-full p-3 text-xs bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-xl text-[var(--text-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Article Body</label>
                  <textarea
                    rows={6}
                    required
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Full article content..."
                    className="w-full p-3 text-xs bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-xl text-[var(--text-primary)] font-mono"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreating(false);
                      setEditingArticle(null);
                    }}
                    className="px-4 py-2 text-xs font-semibold border border-[var(--color-border)] rounded-xl hover:bg-[var(--bg-secondary)]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-[#D4621A] rounded-xl hover:bg-[#D4621A] transition-colors"
                  >
                    Save Article
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="p-6 bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-2xl shadow-xs overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-[var(--text-secondary)] uppercase tracking-wider">
                  <th className="py-3 px-3">Title</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Author</th>
                  <th className="py-3 px-3">Publish Date</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)] text-[var(--text-primary)]">
                {articles.map((art) => (
                  <tr key={art.id} className="hover:bg-[var(--bg-secondary)]/50 transition-colors">
                    <td className="py-3.5 px-3 font-bold text-[var(--text-primary)]">{art.title}</td>
                    <td className="py-3.5 px-3">{art.category || "General"}</td>
                    <td className="py-3.5 px-3">
                      <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded bg-[#FEF3E2] text-[#D4621A] border border-[rgba(42,26,14,0.12)]">
                        {art.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-[var(--text-secondary)]">{art.authorName}</td>
                    <td className="py-3.5 px-3 text-[var(--text-secondary)]">
                      {art.publishAt ? new Date(art.publishAt).toLocaleDateString() : "Not set"}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleStartEdit(art)}
                          className="p-1.5 text-[var(--text-secondary)] hover:text-[#D4621A] border border-[var(--color-border)] rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(art.id)}
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
