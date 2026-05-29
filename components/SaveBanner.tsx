"use client";

import { useState, useEffect } from "react";

export default function SaveBanner({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(true);

  const auditUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/audit/${slug}`
      : "";

  useEffect(() => {
    if (auditUrl) {
      navigator.clipboard.writeText(auditUrl).catch(() => {});
    }
  }, [auditUrl]);

  if (!visible) return null;

  async function handleCopy() {
    if (!auditUrl) return;
    await navigator.clipboard.writeText(auditUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mb-10 p-5 bg-accent-light border border-accent/20 rounded-sm animate-fade-up">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium mb-1">
            Your audit is ready
          </p>
          <p className="text-sm text-muted leading-relaxed">
            This link was copied to your clipboard. Bookmark it or email it to
            yourself — it expires in 30 days.
          </p>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="shrink-0 p-1 text-muted hover:text-foreground transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-label="Dismiss"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <code className="flex-1 min-w-0 text-xs font-mono text-muted bg-white/60 border border-border rounded-sm px-3 py-2 truncate">
          {auditUrl}
        </code>
        <button
          onClick={handleCopy}
          className="shrink-0 inline-flex items-center h-8 px-3 text-xs font-medium bg-foreground text-background rounded-sm hover:bg-foreground/85 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {copied ? "Copied" : "Copy link"}
        </button>
      </div>
    </div>
  );
}
