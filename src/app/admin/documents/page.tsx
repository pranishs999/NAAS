"use client";

import React, { useState, useEffect } from "react";
import { FileText, Download, Trash2, Calendar, ShieldCheck } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { getInquiries } from "@/lib/data/demoStore";
import { AttachedDocumentMetadata, UserRole } from "@/types";

interface EnrichedDocument extends AttachedDocumentMetadata {
  inquiryRef: string;
  applicantName: string;
}

export default function AdminDocumentsPage(): React.JSX.Element {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [documents, setDocuments] = useState<EnrichedDocument[]>([]);
  const [userRole, setUserRole] = useState<UserRole>("admin");
  const [userName, setUserName] = useState("System Admin (Demo)");

  useEffect(() => {
    const inquiries = getInquiries();
    const docsList: EnrichedDocument[] = [];

    inquiries.forEach((inq) => {
      if (inq.documents && inq.documents.length > 0) {
        inq.documents.forEach((doc) => {
          docsList.push({
            ...doc,
            inquiryRef: inq.referenceCode,
            applicantName: inq.fullName,
          });
        });
      }
    });

    setDocuments(docsList);

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

  const handleDeleteDoc = (id: string): void => {
    if (confirm("Delete this document record?")) {
      setDocuments(documents.filter((d) => d.id !== id));
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
        <AdminHeader onToggleMobile={() => setMobileOpen(true)} title="Document Storage & Attachments" />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1">
          <div className="p-4 bg-[var(--action-orange)]/10 border border-[var(--action-orange)]/20 rounded-2xl text-xs text-[var(--action-orange)] space-y-1">
            <div className="flex items-center gap-2 font-bold">
              <ShieldCheck className="w-4 h-4 text-[var(--action-orange)]" />
              <span>Simulated Browser Storage Notice (security.md §3.3)</span>
            </div>
            <p>
              In demo mode, files are stored as base64 URLs in browser memory. Production requires private server storage with malware scanning [Q111].
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Applicant Documents & Certificates</h2>
              <p className="text-xs text-[var(--text-secondary)]">Manage passport scans, degree attestations, and qualification certificates.</p>
            </div>
            <span className="text-xs text-[var(--text-secondary)] font-medium">Total Files: {documents.length}</span>
          </div>

          <div className="p-6 bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-2xl shadow-xs overflow-x-auto">
            {documents.length > 0 ? (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[var(--color-border)] text-[var(--text-secondary)] uppercase tracking-wider">
                    <th className="py-3 px-3">File Name</th>
                    <th className="py-3 px-3">Inquiry Ref</th>
                    <th className="py-3 px-3">Applicant</th>
                    <th className="py-3 px-3">File Size</th>
                    <th className="py-3 px-3">Uploaded Date</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)] text-[var(--text-primary)]">
                  {documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-[var(--bg-secondary)]/50 transition-colors">
                      <td className="py-3.5 px-3 font-semibold flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[var(--action-orange)] flex-shrink-0" />
                        <span className="truncate max-w-xs">{doc.fileName}</span>
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold text-[var(--action-orange)]">
                        {doc.inquiryRef}
                      </td>
                      <td className="py-3.5 px-3">{doc.applicantName}</td>
                      <td className="py-3.5 px-3 font-mono text-[var(--text-secondary)]">
                        {(doc.sizeBytes / (1024 * 1024)).toFixed(2)} MB
                      </td>
                      <td className="py-3.5 px-3 text-[var(--text-secondary)]">
                        {new Date(doc.uploadedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {doc.storageUrl && (
                            <a
                              href={doc.storageUrl}
                              download={doc.fileName}
                              className="p-1.5 text-[var(--action-orange)] border border-[var(--color-border)] rounded-lg hover:bg-[var(--bg-secondary)]"
                              title="Download File"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          )}
                          <button
                            onClick={() => handleDeleteDoc(doc.id)}
                            className="p-1.5 text-[var(--text-secondary)] hover:text-[#D4621A] border border-[var(--color-border)] rounded-lg"
                            title="Delete File Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center space-y-2 text-[var(--text-secondary)]">
                <FileText className="w-8 h-8 mx-auto" />
                <p className="text-xs font-semibold text-[var(--text-primary)]">No document attachments uploaded yet.</p>
                <p className="text-[11px]">Attach files when submitting inquiries through the public forms.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
