"use client";

import Link from "next/link";

export default function AuditError() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16 sm:py-24">
      <div className="py-20 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted mb-4">
          Error
        </p>
        <h1 className="font-display text-3xl sm:text-4xl tracking-tight mb-4">
          Could not load this audit
        </h1>
        <p className="text-sm text-muted mb-8 max-w-sm mx-auto">
          Something went wrong while rendering this audit. Try running it
          again or view one of the showcase audits.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center h-11 px-6 text-sm font-medium bg-foreground text-background rounded-sm hover:bg-foreground/85 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            View showcase
          </Link>
          <Link
            href="/run"
            className="inline-flex items-center h-11 px-5 text-sm text-muted border border-border rounded-sm hover:border-foreground/20 hover:text-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Run a new audit
          </Link>
        </div>
      </div>
    </div>
  );
}
