import Link from "next/link";

export default function Hero() {
  return (
    <section className="max-w-3xl mx-auto px-6 pt-24 pb-20 sm:pt-36 sm:pb-28">
      <div className="animate-fade-up" style={{ animationDelay: "0ms" }}>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted mb-8">
          tools.teddycastro.me
        </p>
      </div>

      <h1
        className="font-display italic text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.1] mb-6 animate-fade-up"
        style={{ animationDelay: "100ms" }}
      >
        Your positioning,
        <br />
        audited
      </h1>

      <div className="animate-fade-up" style={{ animationDelay: "200ms" }}>
        <p className="text-lg leading-relaxed text-foreground/70 max-w-md mb-10">
          Paste a B2B SaaS URL. Get a sharp positioning audit built on April
          Dunford&apos;s framework, with an opinionated diagnosis on top.
        </p>
      </div>

      <div className="animate-fade-up" style={{ animationDelay: "300ms" }}>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link
            href="/run"
            className="inline-flex items-center h-11 px-6 text-sm font-medium bg-foreground text-background rounded-sm hover:bg-foreground/85 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Run your own audit
          </Link>
          <span className="text-sm text-muted">
            Bring your own API key. Never stored.
          </span>
        </div>
      </div>

      <div
        className="animate-fade-up mt-16"
        style={{ animationDelay: "400ms" }}
      >
        <div className="w-full h-px bg-border" />
      </div>
    </section>
  );
}
