import Link from "next/link";
import type { Audit } from "@/types/audit";

export default function AuditCard({
  audit,
  slug,
}: {
  audit: Audit;
  slug: string;
}) {
  const initial = audit.company.name.charAt(0);

  return (
    <Link
      href={`/audit/${slug}`}
      className="group relative block p-6 sm:p-8 border border-border rounded-sm overflow-hidden hover:border-foreground/20 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <span
        className="absolute -right-2 -top-4 text-[120px] leading-none font-display text-foreground/[0.03] select-none pointer-events-none transition-all duration-500 group-hover:text-foreground/[0.06] group-hover:-translate-y-1"
        aria-hidden="true"
      >
        {initial}
      </span>

      <div className="relative">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-4">
          {new URL(audit.company.url).hostname.replace("www.", "")}
        </p>
        <h3 className="font-display text-2xl mb-3 group-hover:text-accent transition-colors duration-200">
          {audit.company.name}
        </h3>
        <p className="text-sm text-muted leading-relaxed line-clamp-2 mb-6">
          {audit.current_positioning_summary}
        </p>
        <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.15em] text-muted group-hover:text-accent transition-colors duration-200">
          Read audit
          <svg
            className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
}
