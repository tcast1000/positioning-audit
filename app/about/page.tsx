import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "Why this positioning audit uses April Dunford's framework, what the diagnosis layer adds, and how BYOK keeps your API key safe.",
};

export default function AboutPage() {
  return (
    <article className="max-w-2xl mx-auto px-6 py-16 sm:py-24">
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

      <header className="mb-16 animate-fade-up">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-4">
          Methodology
        </p>
        <h1 className="font-display text-4xl sm:text-5xl tracking-tight mb-4">
          How this works
        </h1>
        <p className="text-base leading-[1.8] text-foreground/85 max-w-lg">
          A positioning audit that thinks like a PMM, not a chatbot. Built on a
          proven framework with an opinionated diagnosis layer on top.
        </p>
      </header>

      <div className="space-y-16">
        {/* Why positioning */}
        <section>
          <div className="flex items-baseline gap-4 mb-6">
            <span className="font-mono text-xs text-muted/50 tracking-wider">
              01
            </span>
            <h2 className="font-display text-2xl">
              Why positioning matters
            </h2>
          </div>
          <div className="space-y-4 text-sm leading-relaxed text-foreground/85">
            <p>
              Most B2B SaaS companies have a product that works. Their problem is
              not the product. Their problem is that the homepage does not explain
              why anyone should care. The headline hedges. The subhead lists
              features. The visitor leaves.
            </p>
            <p>
              Positioning is the context you set around your product so the right
              buyer immediately understands why it matters to them. Get it wrong
              and your marketing, sales, and product messaging all drift in
              different directions.
            </p>
          </div>
        </section>

        {/* Why Dunford */}
        <section>
          <div className="flex items-baseline gap-4 mb-6">
            <span className="font-mono text-xs text-muted/50 tracking-wider">
              02
            </span>
            <h2 className="font-display text-2xl">
              Why April Dunford&apos;s framework
            </h2>
          </div>
          <div className="space-y-4 text-sm leading-relaxed text-foreground/85">
            <p>
              April Dunford&apos;s framework from{" "}
              <em>Obviously Awesome</em> is the most widely adopted
              positioning model in B2B SaaS. It breaks positioning into five
              components: competitive alternatives, unique attributes, value,
              best-fit customers, and market category.
            </p>
            <p>
              This tool uses these five components as the structural backbone of
              every audit. They force specificity. You cannot hedge when you have
              to name the competitive alternative. You cannot hand-wave when you
              have to connect an attribute to a value the customer cares about.
            </p>
            <p>
              The framework is the lens. But filling in five boxes is not an
              audit. That is where the diagnosis comes in.
            </p>
          </div>
        </section>

        {/* The diagnosis layer */}
        <section>
          <div className="flex items-baseline gap-4 mb-6">
            <span className="font-mono text-xs text-muted/50 tracking-wider">
              03
            </span>
            <h2 className="font-display text-2xl">
              The diagnosis layer
            </h2>
          </div>
          <div className="space-y-4 text-sm leading-relaxed text-foreground/85">
            <p>
              The part that makes this more than a framework exercise. The
              diagnosis reads the homepage copy as a PMM would and calls out
              three things:
            </p>
            <ul className="space-y-3 pl-5">
              <li className="border-l-2 border-accent/40 pl-4">
                <strong>Hedging language.</strong> Words and phrases that sound
                good but say nothing. &quot;Modern,&quot;
                &quot;streamline,&quot; &quot;best-in-class.&quot; If you could
                swap in any competitor&apos;s name and the sentence still works,
                it is hedging.
              </li>
              <li className="border-l-2 border-accent/40 pl-4">
                <strong>Contradictions.</strong> When the homepage promises
                simplicity but the product requires setup. When the hero targets
                developers but the pricing targets enterprise. Internal
                contradictions that confuse the buyer.
              </li>
              <li className="border-l-2 border-accent/40 pl-4">
                <strong>What is missing.</strong> The proof point that is not
                there. The competitor comparison that is avoided. The performance
                claim that would be convincing but is never made.
              </li>
            </ul>
            <p>
              The diagnosis ends with the single highest-leverage change. Not a
              list of ten suggestions. One thing. The one change that would do
              the most to sharpen the positioning.
            </p>
          </div>
        </section>

        {/* How it differs from ChatGPT */}
        <section>
          <div className="flex items-baseline gap-4 mb-6">
            <span className="font-mono text-xs text-muted/50 tracking-wider">
              04
            </span>
            <h2 className="font-display text-2xl">
              Why not just ask ChatGPT
            </h2>
          </div>
          <div className="space-y-4 text-sm leading-relaxed text-foreground/85">
            <p>
              You could paste a homepage into any LLM and ask for positioning
              feedback. You will get a polite, balanced, hedge-everything
              response that reads like a consulting deck. It will tell you your
              positioning is &quot;strong but could be clearer.&quot; It will not
              commit to what is actually wrong.
            </p>
            <p>
              This tool is different because the prompt engineering is opinionated.
              The system prompt bans filler language, forces specific
              recommendations, and requires a concrete rewrite, not a description
              of what a better one might look like. The output reads like a PMM
              talking to a founder, not a chatbot summarizing a webpage.
            </p>
          </div>
        </section>

        {/* BYOK */}
        <section>
          <div className="flex items-baseline gap-4 mb-6">
            <span className="font-mono text-xs text-muted/50 tracking-wider">
              05
            </span>
            <h2 className="font-display text-2xl">
              How BYOK works
            </h2>
          </div>
          <div className="space-y-4 text-sm leading-relaxed text-foreground/85">
            <p>
              BYOK stands for &quot;bring your own key.&quot; You provide your
              Anthropic API key to run an audit. The key is held in your browser,
              sent over HTTPS for a single server-side API call, and immediately
              discarded. It is never stored, logged, or transmitted anywhere
              else.
            </p>
            <p>
              This means you pay Anthropic directly for the API usage (roughly
              $0.05 to $0.10 per audit) and this tool never handles billing,
              subscriptions, or your credentials. The showcase audits on the
              homepage are pre-generated and cost nothing to view.
            </p>
          </div>
        </section>

        {/* Who built this */}
        <section>
          <div className="flex items-baseline gap-4 mb-6">
            <span className="font-mono text-xs text-muted/50 tracking-wider">
              06
            </span>
            <h2 className="font-display text-2xl">
              Who built this
            </h2>
          </div>
          <div className="space-y-4 text-sm leading-relaxed text-foreground/85">
            <p>
              I&apos;m{" "}
              <a
                href="https://teddycastro.me"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 decoration-border hover:decoration-accent hover:text-foreground transition-colors"
              >
                Teddy Castro
              </a>
              , an AI-native full-stack product marketing manager. I build tools
              that show how AI changes PMM work, not by replacing the thinking
              but by making the analysis faster and more rigorous.
            </p>
            <p>
              This tool is built with Next.js, TypeScript, and Claude. The source
              is{" "}
              <a
                href="https://github.com/tcast1000/positioning-audit"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 decoration-border hover:decoration-accent hover:text-foreground transition-colors"
              >
                open on GitHub
              </a>
              .
            </p>
          </div>
        </section>
      </div>

      {/* CTA */}
      <div className="bg-accent-light rounded-sm p-8 sm:p-10 text-center mt-16">
        <p className="font-display text-xl sm:text-2xl mb-2">
          See it in action
        </p>
        <p className="text-sm text-muted mb-6">
          Browse the showcase audits or run your own.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center h-11 px-6 text-sm font-medium bg-foreground text-background rounded-sm hover:bg-foreground/85 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            View showcase
          </Link>
          <Link
            href="/run"
            className="inline-flex items-center h-11 px-5 text-sm border border-border rounded-sm hover:border-foreground/20 hover:text-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Run your own
          </Link>
        </div>
      </div>

      <div className="mt-16">
        <Footer />
      </div>
    </article>
  );
}
