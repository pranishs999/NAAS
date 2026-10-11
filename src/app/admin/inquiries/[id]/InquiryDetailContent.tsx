"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  UserCheck,
  Send,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Calendar,
} from "lucide-react";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import {
  getInquiryById,
  updateInquiryStatus,
  addInquiryNote,
  getInquiryNotes,
  getStatusEvents,
  reassignInquiry,
  getUsers,
} from "@/lib/data/demoStore";
import { Inquiry, InquiryNote, StatusEvent, UserRole, InquiryStatus } from "@/types";

interface InquiryDetailContentProps {
  id: string;
}

export function InquiryDetailContent({ id }: InquiryDetailContentProps): React.JSX.Element {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [inquiry, setInquiry] = useState<Inquiry | undefined>(undefined);
  const [notes, setNotes] = useState<InquiryNote[]>([]);
  const [statusEvents, setStatusEvents] = useState<StatusEvent[]>([]);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [userRole, setUserRole] = useState<UserRole>("admin");
  const [userObj, setUserObj] = useState({ id: "usr-admin-01", name: "System Admin (Demo)" });
  const [allUsers, setAllUsers] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const loadedInq = getInquiryById(id);
    setInquiry(loadedInq);
    if (loadedInq) {
      setNotes(getInquiryNotes(loadedInq.id));
      setStatusEvents(getStatusEvents(loadedInq.id));
    }

    setAllUsers(getUsers().map((u) => ({ id: u.id, name: u.name })));

    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUserRole(data.user.role);
          setUserObj({ id: data.user.id, name: data.user.name });
        }
      })
      .catch(() => {});
  }, [id]);

  if (!inquiry) {
    return (
      <div className="min-h-screen flex bg-[var(--bg-secondary)] items-center justify-center p-4">
        <div className="p-8 bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-2xl text-center space-y-4">
          <AlertTriangle className="w-10 h-10 mx-auto text-[#F4AE52]" />
          <h2 className="text-xl font-bold">Inquiry Record Not Found</h2>
          <p className="text-xs text-[var(--text-secondary)]">No matching inquiry was found for reference ID: {id}</p>
          <Link href="/admin/inquiries" className="inline-block px-4 py-2 text-xs font-bold bg-[#D4621A] text-white rounded-xl">
            Return to Inquiries List
          </Link>
        </div>
      </div>
    );
  }

  const handleStatusChange = (newStatus: InquiryStatus): void => {
    const updated = updateInquiryStatus(inquiry.id, newStatus, userObj);
    if (updated) {
      setInquiry({ ...updated });
      setNotes(getInquiryNotes(inquiry.id));
      setStatusEvents(getStatusEvents(inquiry.id));
    }
  };

  const handleReassign = (assigneeId: string): void => {
    const selected = allUsers.find((u) => u.id === assigneeId);
    if (!selected) return;
    const updated = reassignInquiry(inquiry.id, selected, userObj);
    if (updated) {
      setInquiry({ ...updated });
      setNotes(getInquiryNotes(inquiry.id));
    }
  };

  const handleAddNote = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;
    addInquiryNote(inquiry.id, newNoteContent, userObj, "internal");
    setNewNoteContent("");
    setNotes(getInquiryNotes(inquiry.id));
  };

  // Response-time metrics calculation (Q103)
  const createdTime = new Date(inquiry.createdAt).getTime();
  const nowTime = Date.now();
  const hoursSinceCreation = Math.floor((nowTime - createdTime) / (1000 * 3600));
  const isOverdue = inquiry.status === "new" && hoursSinceCreation > 24;

  const handleLogout = async (): Promise<void> => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  return (
    <div className="min-h-screen flex bg-[var(--bg-secondary)]">
      <AdminSidebar
        userRole={userRole}
        userName={userObj.name}
        onLogout={handleLogout}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onToggleMobile={() => setMobileOpen(true)} title={`Inquiry: ${inquiry.referenceCode}`} />

        <main className="p-4 sm:p-6 lg:p-8 space-y-8 flex-1">
          {/* Back Navigation & Ref Code Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Link
              href="/admin/inquiries"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--action-orange)] hover:underline"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Inquiries List
            </Link>

            <div className="flex items-center gap-3">
              <span className="font-mono font-black text-lg text-[var(--action-orange)]">
                {inquiry.referenceCode}
              </span>
              <StatusBadge status={inquiry.status} />
              {isOverdue && (
                <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase bg-[#D4621A]/15 text-[#D4621A] rounded flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Response Overdue (&gt;24h)
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Col: Applicant Details & Actions */}
            <div className="lg:col-span-5 space-y-6">
              {/* Applicant Card */}
              <div className="p-6 bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-2xl shadow-xs space-y-4">
                <h3 className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--color-border)] pb-3">
                  Applicant & Inquiry Info
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[var(--text-secondary)] block text-[10px] uppercase font-bold">Full Name</span>
                    <span className="font-bold text-[var(--text-primary)] text-sm">{inquiry.fullName}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-secondary)] block text-[10px] uppercase font-bold">Email Address</span>
                    <a href={`mailto:${inquiry.email}`} className="text-[#D4621A] font-mono hover:underline font-bold">
                      {inquiry.email}
                    </a>
                  </div>
                  {inquiry.phone && (
                    <div>
                      <span className="text-[var(--text-secondary)] block text-[10px] uppercase font-bold">Phone Number</span>
                      <a href={`tel:${inquiry.phone}`} className="text-[#D4621A] font-mono hover:underline font-bold">
                        {inquiry.phone}
                      </a>
                    </div>
                  )}
                  <div>
                    <span className="text-[var(--text-secondary)] block text-[10px] uppercase font-bold">Branch</span>
                    <span className="capitalize font-semibold text-[var(--text-primary)]">{inquiry.branch}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-secondary)] block text-[10px] uppercase font-bold">Submission Date</span>
                    <span className="text-[var(--text-primary)]">{new Date(inquiry.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                {/* Additional Form Fields */}
                {inquiry.formData && (
                  <div className="pt-3 border-t border-[var(--color-border)] space-y-2 text-xs">
                    <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] block">Detailed Requirements</span>
                    {Object.entries(inquiry.formData).map(([key, val]) => (
                      val ? (
                        <div key={key} className="flex justify-between">
                          <span className="text-[var(--text-secondary)] capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                          <span className="font-semibold text-[var(--text-primary)]">{String(val)}</span>
                        </div>
                      ) : null
                    ))}
                  </div>
                )}
              </div>

              {/* Workflow Controls Card */}
              <div className="p-6 bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-2xl shadow-xs space-y-4">
                <h3 className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--color-border)] pb-3">
                  Workflow & Assignment Controls
                </h3>

                {/* Status Update (Q36) */}
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Update Status</label>
                  <select
                    value={inquiry.status}
                    onChange={(e) => handleStatusChange(e.target.value as InquiryStatus)}
                    className="w-full px-3 py-2 text-xs bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-xl font-bold text-[var(--text-primary)]"
                  >
                    <option value="new">New</option>
                    <option value="in_review">In Review</option>
                    <option value="contacted">Contacted</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Manual Reassignment (line 311) */}
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Assigned Staff</label>
                  <select
                    value={inquiry.assigneeId || ""}
                    onChange={(e) => handleReassign(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-xl font-medium text-[var(--text-primary)]"
                  >
                    <option value="">-- Unassigned --</option>
                    {allUsers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* WhatsApp Direct Action */}
                <div className="pt-2 border-t border-[var(--color-border)]">
                  <span className="text-[10px] font-bold uppercase text-[var(--text-secondary)] block mb-2">Direct Client Follow-Up</span>
                  <WhatsAppButton referenceCode={inquiry.referenceCode} label="Open WhatsApp Chat with Candidate" />
                </div>
              </div>

              {/* Attached Documents Viewer (Q112) */}
              {inquiry.documents && inquiry.documents.length > 0 && (
                <div className="p-6 bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-2xl shadow-xs space-y-3">
                  <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[var(--accent-gold)]" /> Attached Applicant Files ({inquiry.documents.length})
                  </h3>
                  <ul className="space-y-2 text-xs">
                    {inquiry.documents.map((doc) => (
                      <li key={doc.id} className="p-2.5 bg-[var(--bg-secondary)] border border-[var(--color-border)] rounded-xl flex items-center justify-between">
                        <span className="font-semibold text-[var(--text-primary)] truncate">{doc.fileName}</span>
                        {doc.storageUrl ? (
                          <a
                            href={doc.storageUrl}
                            download={doc.fileName}
                            className="text-[11px] font-bold text-[var(--accent-gold)] hover:underline"
                          >
                            Download
                          </a>
                        ) : (
                          <span className="text-[10px] text-[var(--text-secondary)]">Simulated File</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Col: Unified Timeline & Internal Notes (Q104) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Internal Note Form */}
              <div className="p-6 bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-2xl shadow-xs space-y-4">
                <h3 className="text-base font-bold text-[var(--text-primary)]">Add Internal Note</h3>
                <form onSubmit={handleAddNote} className="space-y-3">
                  <textarea
                    rows={3}
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    placeholder="Enter internal staff observation or status update note..."
                    className="w-full p-3 text-xs bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-xl text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-gold)]"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#D4621A] text-white text-xs font-bold rounded-xl hover:opacity-90 inline-flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" /> Save Internal Note
                    </button>
                  </div>
                </form>
              </div>

              {/* Unified Timeline List (Q104) */}
              <div className="p-6 bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-2xl shadow-xs space-y-6">
                <h3 className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--color-border)] pb-3">
                  Unified Communication & Status Timeline
                </h3>

                <div className="space-y-6 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[var(--color-border)]">
                  {notes.map((note) => (
                    <div key={note.id} className="relative pl-8 space-y-1">
                      <div className="absolute left-1.5 top-1 w-4 h-4 rounded-full bg-[var(--accent-gold)] border-2 border-[var(--bg-primary)]" />
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[var(--text-primary)]">{note.authorName}</span>
                        <span className="text-[10px] text-[var(--text-secondary)]">
                          {new Date(note.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--color-border)] rounded-xl text-xs text-[var(--text-primary)]">
                        {note.content}
                      </div>
                    </div>
                  ))}

                  {/* Submission Origin Event */}
                  <div className="relative pl-8 space-y-1">
                    <div className="absolute left-1.5 top-1 w-4 h-4 rounded-full bg-[var(--color-success)] border-2 border-[var(--bg-primary)]" />
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[var(--color-success)]">Inquiry Received</span>
                      <span className="text-[10px] text-[var(--text-secondary)]">
                        {new Date(inquiry.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)]">
                      Submitted by visitor <span className="font-semibold">{inquiry.fullName}</span> via public form. Initial reference code generated: <span className="font-mono font-bold">{inquiry.referenceCode}</span>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
