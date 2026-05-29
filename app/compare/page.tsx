"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import type { Audit } from "@/types/audit";

const SHOWCASE_SLUGS = ["linear", "notion", "vercel"];

type AuditEntry = {
  slug: string;
  audit: Audit | null;
  loading: boolean;
  error: string;
};

function ComparisonCell({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-sm leading-relaxed min-w-[240px] flex-1 px-4 py-3">
      {children}
    </div>
  );
}

function RowLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted py-3 px-4 min-w-[160px] shrink-0">
      {children}
    </div>
  );
}

export default function ComparePage() {
  const [entries, setEntries] = useState<AuditEntry[]>(
    SHOWCASE_SLUGS.map((slug) => ({
      slug,
      audit: null,
      loading: true,
      error: "",
    }))
  );
  const [slugInput, setSlugInput] = useState("");

  useEffect(() => {
    entries.forEach((entry, i) => {
      if (entry.loading && entry.slug) {
        fetchAudit(entry.slug, i);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchAudit(slug: string, index: number) {
    try {
      const res = await fetch(`/api/audit/${slug}`);
      if (!res.ok) throw new Error("Not found");
      const audit = await res.json();
      setEntries((prev) =>
        prev.map((e, i) =>
          i === index ? { ...e, audit, loading: false } : e
        )
      );
    } catch {
      setEntries((prev) =>
        prev.map((e, i) =>
          i === index
            ? { ...e, loading: false, error: "Could not load audit" }
            : e
        )
      );
    }
  }

  function addAudit() {
    const slug = slugInput.trim().replace(/.*\/audit\//, "").replace(/\/$/, "");
    if (!slug) return;
    if (entries.length >= 4) return;
    if (entries.some((e) => e.slug === slug)) return;
    const newIndex = entries.length;
    setEntries((prev) => [
      ...prev,
      { slug, audit: null, loading: true, error: "" },
    ]);
    setSlugInput("");
    fetchAudit(slug, newIndex);
  }

  function removeAudit(index: number) {
    setEntries((prev) => prev.filter((_, i) => i !== index));
  }

  const loaded = entries.filter((e) => e.audit);

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 sm:py-24">
      <nav className="mb-16 animate-fade-in">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 16l-4-4m0 0l4-4m-4 4h18"
            />
          </svg>
          Back
        </Link>
      </nav>

      <header className="mb-12 animate-fade-up">
        <h1 className="font-display text-3xl sm:text-4xl tracking-tight mb-3">
          Compare audits
        </h1>
        <p className="text-sm text-muted leading-relaxed max-w-lg">
          View positioning audits side by side. The showcase audits are
          pre-loaded. Add your own by pasting an audit URL or slug.
        </p>
      </header>

      {/* Add audit input */}
      {entries.length < 4 && (
        <div className="flex gap-3 mb-10 animate-fade-up" style={{ animationDelay: "100ms" }}>
          <input
            type="text"
            placeholder="Paste an audit URL or slug..."
            value={slugInput}
            onChange={(e) => setSlugInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addAudit()}
            className="flex-1 h-11 px-4 text-sm bg-white border border-border rounded-sm placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
          />
          <button
            onClick={addAudit}
            disabled={!slugInput.trim()}
            className="inline-flex items-center h-11 px-5 text-sm font-medium border border-border rounded-sm hover:border-foreground/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Add
          </button>
        </div>
      )}

      {/* Column headers */}
      {loaded.length > 0 && (
        <div className="overflow-x-auto">
          <div className="min-w-max">
            {/* Company names */}
            <div className="flex border-b border-border">
              <RowLabel>&nbsp;</RowLabel>
              {entries.map((entry, i) => (
                <div
                  key={i}
                  className="min-w-[240px] flex-1 px-4 py-4"
                >
                  {entry.audit ? (
                    <div className="flex items-baseline justify-between gap-2">
                      <div>
                        <Link
                          href={`/audit/${entry.slug}`}
                          className="font-display text-xl hover:text-accent transition-colors"
                        >
                          {entry.audit.company.name}
                        </Link>
                        <p className="font-mono text-[10px] text-muted mt-1">
                          {entry.audit.company.url.replace(/^https?:\/\//, "")}
                        </p>
                      </div>
                      {!SHOWCASE_SLUGS.includes(entry.slug) && (
                        <button
                          onClick={() => removeAudit(i)}
                          className="text-xs text-muted hover:text-foreground transition-colors"
                          aria-label={`Remove ${entry.audit.company.name}`}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ) : entry.loading ? (
                    <p className="text-sm text-muted">Loading...</p>
                  ) : (
                    <p className="text-sm text-red-600">{entry.error}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="flex border-b border-border">
              <RowLabel>Summary</RowLabel>
              {entries.map((entry, i) => (
                <ComparisonCell key={i}>
                  {entry.audit ? (
                    <p className="text-muted">
                      {entry.audit.current_positioning_summary}
                    </p>
                  ) : null}
                </ComparisonCell>
              ))}
            </div>

            {/* Best-fit customer */}
            <div className="flex border-b border-border">
              <RowLabel>Best-fit customer</RowLabel>
              {entries.map((entry, i) => (
                <ComparisonCell key={i}>
                  {entry.audit?.dunford.best_fit_customer}
                </ComparisonCell>
              ))}
            </div>

            {/* Market category */}
            <div className="flex border-b border-border">
              <RowLabel>Market category</RowLabel>
              {entries.map((entry, i) => (
                <ComparisonCell key={i}>
                  {entry.audit?.dunford.market_category}
                </ComparisonCell>
              ))}
            </div>

            {/* Unique attributes */}
            <div className="flex border-b border-border">
              <RowLabel>Unique attributes</RowLabel>
              {entries.map((entry, i) => (
                <ComparisonCell key={i}>
                  {entry.audit?.dunford.unique_attributes.length ? (
                    <ul className="space-y-2">
                      {entry.audit.dunford.unique_attributes.map((a, j) => (
                        <li
                          key={j}
                          className="pl-3 border-l-2 border-border text-xs leading-relaxed"
                        >
                          {a}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </ComparisonCell>
              ))}
            </div>

            {/* Highest-leverage change */}
            <div className="flex border-b border-border bg-accent-light/30">
              <RowLabel>First change</RowLabel>
              {entries.map((entry, i) => (
                <ComparisonCell key={i}>
                  {entry.audit ? (
                    <p className="font-medium text-xs leading-relaxed">
                      {entry.audit.diagnosis.first_change}
                    </p>
                  ) : null}
                </ComparisonCell>
              ))}
            </div>

            {/* Sharper headline */}
            <div className="flex border-b border-border">
              <RowLabel>Current headline</RowLabel>
              {entries.map((entry, i) => (
                <ComparisonCell key={i}>
                  {entry.audit ? (
                    <p className="text-muted line-through decoration-muted/40 text-xs">
                      {entry.audit.rewrite.current_headline}
                    </p>
                  ) : null}
                </ComparisonCell>
              ))}
            </div>

            <div className="flex">
              <RowLabel>Sharper headline</RowLabel>
              {entries.map((entry, i) => (
                <ComparisonCell key={i}>
                  {entry.audit ? (
                    <p className="font-medium text-xs leading-relaxed border-l-2 border-accent pl-3">
                      {entry.audit.rewrite.sharper_headline}
                    </p>
                  ) : null}
                </ComparisonCell>
              ))}
            </div>
          </div>
        </div>
      )}

      {loaded.length === 0 && !entries.some((e) => e.loading) && (
        <div className="text-center py-20">
          <p className="text-sm text-muted">No audits loaded.</p>
        </div>
      )}

      <div className="mt-24">
        <Footer />
      </div>
    </div>
  );
}
