import React from "react";
import { Loader2, AlertCircle, Inbox } from "lucide-react";

export function LoadingState({ message = "Loading content..." }: { message?: string }): React.JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center" aria-busy="true">
      <Loader2 className="w-8 h-8 animate-spin text-[#D4621A] mb-3" />
      <p className="text-sm font-medium text-[var(--text-secondary)]">{message}</p>
    </div>
  );
}

export function ErrorState({
  message = "Something went wrong loading this section.",
  retryAction,
}: {
  message?: string;
  retryAction?: () => void;
}): React.JSX.Element {
  return (
    <div role="alert" className="flex flex-col items-center justify-center p-8 text-center bg-[#D4621A]/5 rounded-2xl border border-[#D4621A]/20">
      <AlertCircle className="w-8 h-8 text-[#D4621A] mb-3" />
      <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">Unable to display data</p>
      <p className="text-xs text-[var(--text-secondary)] max-w-md mb-4">{message}</p>
      {retryAction && (
        <button
          onClick={retryAction}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#D4621A] rounded-xl hover:bg-[#D4621A] transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

export function EmptyState({
  title = "No data available",
  description = "There are no records matching your current request.",
  action,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}): React.JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-[var(--color-border)] rounded-2xl">
      <Inbox className="w-10 h-10 text-[var(--text-secondary)] mb-3 opacity-60" />
      <h4 className="text-base font-bold text-[var(--text-primary)] mb-1">{title}</h4>
      <p className="text-sm text-[var(--text-secondary)] max-w-sm mb-4">{description}</p>
      {action}
    </div>
  );
}
