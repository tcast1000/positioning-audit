"use client";

import Link from "next/link";
import { useAuditHistory } from "@/lib/useAuditHistory";

/* ------------------------------------------------------------------ */
/*  Relative-time formatter                                           */
/* ------------------------------------------------------------------ */

function relativeTime(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffMs = now - then;

  if (Number.isNaN(then)) return "";

  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) return "just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;

  const months = Math.floor(days / 30);
  if (months === 1) return "1 month ago";
  return `${months} months ago`;
}

function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function RecentAudits() {
  const { history, clearHistory } = useAuditHistory();

  if (history.length === 0) return null;

  return (
    <section className="max-w-3xl mx-auto px-6 pb-24 animate-fade-up">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          Your recent audits
        </h2>
        <button
          onClick={clearHistory}
          className="text-xs text-muted hover:text-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
        >
          Clear history
        </button>
      </div>

      <ul className="divide-y divide-border">
        {history.map((entry) => (
          <li key={entry.slug}>
            <Link
              href={`/audit/${entry.slug}`}
              className="group flex items-baseline justify-between gap-4 py-3 transition-colors duration-200 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
            >
              <span className="flex items-baseline gap-3 min-w-0">
                <span className="font-display text-lg truncate">
                  {entry.companyName}
                </span>
                <span className="font-mono text-xs text-muted shrink-0 hidden sm:inline">
                  {hostname(entry.companyUrl)}
                </span>
              </span>
              <span className="font-mono text-xs text-muted whitespace-nowrap shrink-0">
                {relativeTime(entry.generatedAt)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
