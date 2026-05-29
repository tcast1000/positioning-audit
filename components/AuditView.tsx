import type { Audit } from "@/types/audit";
import Link from "next/link";
import Footer from "@/components/Footer";
import ShareButton from "@/components/ShareButton";
import DownloadButton from "@/components/DownloadButton";
import EmailButton from "@/components/EmailButton";
import AuditClientEffects from "@/components/AuditClientEffects";

function Divider() {
  return <div className="w-full h-px bg-border my-14 sm:my-16" />;
}

function SectionTitle({
  children,
  n,
}: {
  children: React.ReactNode;
  n: string;
}) {
  return (
    <div className="flex items-baseline gap-4 mb-8">
      <span className="font-mono text-xs text-muted/50 tracking-wider">
        {n}
      </span>
      <h2 className="font-display text-2xl sm:text-3xl">{children}</h2>
    </div>
  );
}

function SubsectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted mb-4">
      {children}
    </h3>
  );
}

function ListItems({ items }: { items: string[] }) {
  return (
    <ul className="space-y-4">
      {items.map((item, i) => (
        <li
          key={i}
          className="text-sm leading-relaxed pl-5 border-l-2 border-border hover:border-accent/40 transition-colors duration-200"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function DiagnosisItems({ items }: { items: string[] }) {
  return (
    <ul className="space-y-4">
      {items.map((item, i) => (
        <li
          key={i}
          className="text-sm leading-relaxed pl-5 py-2 border-l-2 border-accent/40 bg-accent-light/50 rounded-r-sm"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function RewriteBlock({
  label,
  current,
  sharper,
}: {
  label: string;
  current: string;
  sharper: string;
}) {
  return (
    <div>
      <SubsectionTitle>{label}</SubsectionTitle>
      <div className="space-y-4">
        <div className="pl-5 border-l-2 border-border">
          <p className="text-sm leading-relaxed text-muted line-through decoration-muted/40">
            {current}
          </p>
        </div>
        <div className="pl-5 border-l-2 border-accent">
          <p className="text-base leading-relaxed font-medium">{sharper}</p>
        </div>
      </div>
    </div>
  );
}

export default function AuditView({
  audit,
  slug,
  isNew = false,
}: {
  audit: Audit;
  slug?: string;
  isNew?: boolean;
}) {
  const date = new Date(audit.generated_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="max-w-2xl mx-auto px-6 py-16 sm:py-24">
      {/* Nav */}
      <nav className="flex items-center justify-between mb-16 animate-fade-in">
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
          All audits
        </Link>
        <div className="flex items-center gap-1">
          <ShareButton />
          <EmailButton slug={slug ?? ""} companyName={audit.company.name} />
          <DownloadButton companyName={audit.company.name} />
        </div>
      </nav>

      {slug && (
        <AuditClientEffects
          slug={slug}
          companyName={audit.company.name}
          companyUrl={audit.company.url}
          generatedAt={audit.generated_at}
          isNew={isNew}
        />
      )}

      {/* Header */}
      <header className="mb-16 animate-fade-up">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-4">
          Positioning audit
        </p>
        <h1 className="font-display text-4xl sm:text-5xl tracking-tight mb-4">
          {audit.company.name}
        </h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
          <a
            href={audit.company.url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 decoration-border hover:decoration-accent hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
          >
            {audit.company.url.replace(/^https?:\/\//, "")}
          </a>
          <span className="text-border" aria-hidden="true">|</span>
          <time dateTime={audit.generated_at}>{date}</time>
        </div>
      </header>

      {/* 01 — Summary */}
      <section>
        <SectionTitle n="01">Summary</SectionTitle>
        <p className="text-base leading-[1.8] text-foreground/85">
          {audit.current_positioning_summary}
        </p>
      </section>

      <Divider />

      {/* 02 — Positioning components */}
      <section>
        <SectionTitle n="02">Positioning components</SectionTitle>

        <div className="space-y-10">
          <div>
            <SubsectionTitle>Competitive alternatives</SubsectionTitle>
            <ListItems items={audit.dunford.competitive_alternatives} />
          </div>

          <div>
            <SubsectionTitle>Unique attributes</SubsectionTitle>
            <ListItems items={audit.dunford.unique_attributes} />
          </div>

          <div>
            <SubsectionTitle>Value</SubsectionTitle>
            <ListItems items={audit.dunford.value} />
          </div>

          <div className="grid gap-8 sm:grid-cols-2 pt-2">
            <div>
              <SubsectionTitle>Best-fit customer</SubsectionTitle>
              <p className="text-sm leading-relaxed">
                {audit.dunford.best_fit_customer}
              </p>
            </div>
            <div>
              <SubsectionTitle>Market category</SubsectionTitle>
              <p className="text-sm leading-relaxed">
                {audit.dunford.market_category}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* 03 — Diagnosis */}
      <section>
        <SectionTitle n="03">Diagnosis</SectionTitle>

        <div className="space-y-10">
          <div>
            <SubsectionTitle>Hedging language</SubsectionTitle>
            <DiagnosisItems items={audit.diagnosis.hedging} />
          </div>

          <div>
            <SubsectionTitle>Contradictions</SubsectionTitle>
            <DiagnosisItems items={audit.diagnosis.contradictions} />
          </div>

          <div>
            <SubsectionTitle>Missing</SubsectionTitle>
            <DiagnosisItems items={audit.diagnosis.missing} />
          </div>

          <div className="relative bg-accent-light rounded-sm p-6 sm:p-8 border-l-4 border-accent">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-3">
              Highest-leverage change
            </p>
            <p className="text-base sm:text-lg leading-relaxed font-medium">
              {audit.diagnosis.first_change}
            </p>
          </div>
        </div>
      </section>

      <Divider />

      {/* 04 — Rewrite */}
      <section>
        <SectionTitle n="04">Rewrite</SectionTitle>

        <div className="space-y-10">
          <RewriteBlock
            label="Headline"
            current={audit.rewrite.current_headline}
            sharper={audit.rewrite.sharper_headline}
          />
          <RewriteBlock
            label="Subhead"
            current={audit.rewrite.current_subhead}
            sharper={audit.rewrite.sharper_subhead}
          />
        </div>
      </section>

      {/* CTA */}
      <div className="no-print bg-accent-light rounded-sm p-8 sm:p-10 text-center mt-16">
        <p className="font-display text-xl sm:text-2xl mb-2">
          Want one for your company?
        </p>
        <p className="text-sm text-muted mb-6">
          Bring your own API key. It never leaves your browser except for one
          server-side call.
        </p>
        <Link
          href="/run"
          className="inline-flex items-center h-11 px-6 text-sm font-medium bg-foreground text-background rounded-sm hover:bg-foreground/85 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Run your own audit
        </Link>
      </div>

      {/* Footer */}
      <div className="mt-16">
        <Footer />
      </div>
    </article>
  );
}
