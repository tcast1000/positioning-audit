import Hero from "@/components/Hero";
import AuditCard from "@/components/AuditCard";
import Footer from "@/components/Footer";
import type { Audit } from "@/types/audit";

import linearAudit from "@/content/showcase/linear.json";
import notionAudit from "@/content/showcase/notion.json";
import vercelAudit from "@/content/showcase/vercel.json";

const showcaseAudits: { slug: string; audit: Audit }[] = [
  { slug: "linear", audit: linearAudit as Audit },
  { slug: "notion", audit: notionAudit as Audit },
  { slug: "vercel", audit: vercelAudit as Audit },
];

export default function HomePage() {
  return (
    <>
      <Hero />
      <section className="max-w-3xl mx-auto px-6 pb-24">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            Showcase audits
          </h2>
          <p className="text-sm text-muted hidden sm:block">
            Pre-generated, zero tokens
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {showcaseAudits.map(({ slug, audit }) => (
            <AuditCard key={slug} slug={slug} audit={audit} />
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-24">
        <div className="w-full h-px bg-border mb-16" />
        <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted mb-10">
          How it works
        </h2>
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <p className="font-mono text-xs text-muted/50 tracking-wider mb-2">
              01
            </p>
            <h3 className="font-display text-lg mb-2">Paste a URL</h3>
            <p className="text-sm text-muted leading-relaxed">
              Enter any B2B SaaS homepage. The tool scrapes the visible copy. If
              the site blocks scraping, you paste the text yourself.
            </p>
          </div>
          <div>
            <p className="font-mono text-xs text-muted/50 tracking-wider mb-2">
              02
            </p>
            <h3 className="font-display text-lg mb-2">Claude runs the audit</h3>
            <p className="text-sm text-muted leading-relaxed">
              Your Anthropic API key is used for one server-side call. The key
              is never stored, logged, or sent anywhere else.
            </p>
          </div>
          <div>
            <p className="font-mono text-xs text-muted/50 tracking-wider mb-2">
              03
            </p>
            <h3 className="font-display text-lg mb-2">Get a shareable link</h3>
            <p className="text-sm text-muted leading-relaxed">
              Your audit gets its own URL you can share with your team. Results
              are stored for 30 days.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 pb-12">
        <Footer />
      </div>
    </>
  );
}
