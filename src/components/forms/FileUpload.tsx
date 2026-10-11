"use client";

import React, { useState } from "react";
import { UploadCloud, FileText, X, AlertCircle } from "lucide-react";
import { AttachedDocumentMetadata } from "@/types";
import { fileUploadConstraints } from "@/lib/validation/schemas";

interface FileUploadProps {
  onFilesChange: (files: AttachedDocumentMetadata[]) => void;
  maxFiles?: number;
}

export function FileUpload({ onFilesChange, maxFiles = 3 }: FileUploadProps): React.JSX.Element {
  const [attachedFiles, setAttachedFiles] = useState<AttachedDocumentMetadata[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setErrorMsg(null);
    const newFiles: AttachedDocumentMetadata[] = [...attachedFiles];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file) continue;

      if (newFiles.length >= maxFiles) {
        setErrorMsg(`Maximum limit of ${maxFiles} attached files reached.`);
        break;
      }

      if (file.size > fileUploadConstraints.maxSizeBytes) {
        setErrorMsg(`File "${file.name}" exceeds the 10MB limit.`);
        continue;
      }

      if (!fileUploadConstraints.allowedTypes.includes(file.type)) {
        setErrorMsg(`File "${file.name}" type is not supported. Allowed: PDF, JPG, PNG, DOCX.`);
        continue;
      }

      // Convert file to base64 for demo store representation
      const reader = new FileReader();
      reader.onload = () => {
        const base64Url = reader.result as string;
        const fileMeta: AttachedDocumentMetadata = {
          id: `doc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          fileName: file.name,
          mimeType: file.type,
          sizeBytes: file.size,
          uploadedAt: new Date().toISOString(),
          storageUrl: base64Url,
        };

        newFiles.push(fileMeta);
        setAttachedFiles([...newFiles]);
        onFilesChange([...newFiles]);
      };
      reader.readAsDataURL(file);
    }

    e.target.value = "";
  };

  const removeFile = (id: string): void => {
    const updated = attachedFiles.filter((f) => f.id !== id);
    setAttachedFiles(updated);
    onFilesChange(updated);
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-semibold text-[var(--text-primary)]">
        Attach Documents (Optional - PDF, JPG, PNG, DOCX, Max 10MB)
      </label>

      <div className="relative border-2 border-dashed border-[var(--color-border)] hover:border-[#D4621A] rounded-xl p-4 text-center bg-[var(--bg-secondary)]/50 transition-colors">
        <input
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.docx"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          title="Choose files to upload"
        />
        <div className="flex flex-col items-center justify-center gap-1.5 pointer-events-none">
          <UploadCloud className="w-6 h-6 text-[#D4621A]" />
          <span className="text-xs font-medium text-[var(--text-primary)]">
            Click or drag files here to attach
          </span>
          <span className="text-[10px] text-[var(--text-secondary)]">
            {attachedFiles.length} of {maxFiles} files attached
          </span>
        </div>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 text-xs text-[#D4621A] bg-[#D4621A]/10 p-2.5 rounded-lg border border-[#D4621A]/20">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {attachedFiles.length > 0 && (
        <ul className="space-y-2 pt-1">
          {attachedFiles.map((file) => (
            <li
              key={file.id}
              className="flex items-center justify-between p-2.5 bg-[#FEF3E2] border border-[rgba(42,26,14,0.12)] rounded-lg text-xs"
            >
              <div className="flex items-center gap-2 truncate">
                <FileText className="w-4 h-4 text-[#D4621A] flex-shrink-0" />
                <span className="font-medium text-[var(--text-primary)] truncate">{file.fileName}</span>
                <span className="text-[10px] text-[var(--text-secondary)]">
                  ({(file.sizeBytes / (1024 * 1024)).toFixed(2)} MB)
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeFile(file.id)}
                aria-label={`Remove file ${file.fileName}`}
                className="p-1 text-[var(--text-secondary)] hover:text-[#D4621A] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
