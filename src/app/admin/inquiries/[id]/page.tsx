import React, { Suspense } from "react";
import { connection } from "next/server";
import { InquiryDetailContent } from "./InquiryDetailContent";

interface InquiryDetailPageProps {
  params: Promise<{ id: string }>;
}

function LoadingFallback(): React.JSX.Element {
  return (
    <div className="min-h-screen flex bg-[var(--bg-secondary)] items-center justify-center p-4">
      <div className="p-8 bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-2xl text-center space-y-4">
        <div className="w-8 h-8 mx-auto border-4 border-[var(--accent-gold)] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-[var(--text-secondary)]">Loading inquiry details…</p>
      </div>
    </div>
  );
}

async function InquiryDetailInner({ params }: InquiryDetailPageProps): Promise<React.JSX.Element> {
  await connection();
  const { id } = await params;
  return <InquiryDetailContent id={id} />;
}

export default function InquiryDetailPage({ params }: InquiryDetailPageProps): React.JSX.Element {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <InquiryDetailInner params={params} />
    </Suspense>
  );
}
