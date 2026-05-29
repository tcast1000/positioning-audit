"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer";

type Step = "input" | "scraping" | "confirm" | "paste" | "synthesizing";

function estimateCost(textLength: number): string {
  const systemPromptTokens = 700;
  const messageOverhead = 20;
  const inputTextTokens = Math.ceil(textLength / 4);
  const totalInputTokens = systemPromptTokens + messageOverhead + inputTextTokens;
  const outputTokens = 3000;
  const cost =
    (totalInputTokens / 1_000_000) * 3 + (outputTokens / 1_000_000) * 15;
  if (cost < 0.01) return "< $0.01";
  return `~$${cost.toFixed(2)}`;
}

export default function RunPage() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [pastedText, setPastedText] = useState("");
  const [scrapedText, setScrapedText] = useState("");
  const [resolvedUrl, setResolvedUrl] = useState("");
  const [step, setStep] = useState<Step>("input");
  const [error, setError] = useState("");

  async function handleScrape() {
    setError("");

    let parsed: URL;
    try {
      parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
    } catch {
      setError("Enter a valid URL.");
      return;
    }

    if (!apiKey.startsWith("sk-ant-")) {
      setError("That doesn't look like an Anthropic API key.");
      return;
    }

    setResolvedUrl(parsed.href);
    setStep("scraping");

    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: parsed.href }),
      });
      const data = await res.json();

      if (data.sufficient && data.text) {
        setScrapedText(data.text);
        setStep("confirm");
      } else {
        setScrapedText(data.text || "");
        setStep("paste");
      }
    } catch {
      setStep("paste");
    }
  }

  function handleConfirm() {
    if (step === "synthesizing") return;
    runSynthesis(resolvedUrl, scrapedText);
  }

  function handlePasteSubmit() {
    if (step === "synthesizing") return;
    if (pastedText.trim().length < 100) {
      setError("Paste at least a few paragraphs of homepage copy.");
      return;
    }
    setError("");
    runSynthesis(resolvedUrl, pastedText.trim());
  }

  async function runSynthesis(targetUrl: string, text: string) {
    setStep("synthesizing");
    setError("");

    try {
      const res = await fetch("/api/synthesize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl, apiKey, pastedText: text }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setStep("input");
        return;
      }

      router.push(`/audit/${data.slug}?new=1`);
    } catch {
      setError("Network error. Check your connection and try again.");
      setStep("input");
    }
  }

  const isLoading = step === "scraping" || step === "synthesizing";
  const activeText = scrapedText || pastedText;

  return (
    <div className="max-w-xl mx-auto px-6 py-16 sm:py-24">
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
          Run your own audit
        </h1>
        <p className="text-sm text-muted leading-relaxed max-w-md">
          Enter a B2B SaaS URL and your Anthropic API key. The key is used for
          one server-side call and is never stored or logged.
        </p>
      </header>

      {(step === "input" || step === "scraping") && (
        <div
          className="space-y-6 animate-fade-up"
          style={{ animationDelay: "100ms" }}
        >
          <div>
            <label
              htmlFor="url"
              className="block font-mono text-[11px] uppercase tracking-[0.2em] text-muted mb-2"
            >
              Company URL
            </label>
            <input
              id="url"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isLoading}
              className="w-full h-11 px-4 text-sm bg-white border border-border rounded-sm placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50"
            />
          </div>

          <div>
            <label
              htmlFor="apiKey"
              className="block font-mono text-[11px] uppercase tracking-[0.2em] text-muted mb-2"
            >
              Anthropic API key
            </label>
            <input
              id="apiKey"
              type="password"
              placeholder="sk-ant-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              disabled={isLoading}
              autoComplete="off"
              className="w-full h-11 px-4 text-sm bg-white border border-border rounded-sm placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 font-mono"
            />
            <details className="mt-3 text-xs text-muted group">
              <summary className="cursor-pointer hover:text-foreground transition-colors select-none">
                How your key is handled
              </summary>
              <ul className="mt-2 space-y-1.5 pl-4 list-disc marker:text-border">
                <li>Sent over HTTPS to this server for one Anthropic API call</li>
                <li>Held in memory for the duration of that call only</li>
                <li>Never written to a database, log file, or analytics service</li>
                <li>Never sent to any third party besides Anthropic</li>
                <li>Discarded immediately after the response is received</li>
                <li>
                  Source code is{" "}
                  <a
                    href="https://github.com/tcast1000/positioning-audit"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-foreground transition-colors"
                  >
                    open on GitHub
                  </a>{" "}
                  so you can verify
                </li>
              </ul>
            </details>
          </div>

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <button
            onClick={handleScrape}
            disabled={isLoading || !url || !apiKey}
            className="inline-flex items-center h-11 px-6 text-sm font-medium bg-foreground text-background rounded-sm hover:bg-foreground/85 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {step === "scraping" ? (
              <>
                <svg
                  className="w-4 h-4 mr-2 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Fetching site...
              </>
            ) : (
              "Run audit"
            )}
          </button>
        </div>
      )}

      {step === "confirm" && (
        <div className="space-y-6 animate-fade-up">
          <div className="p-5 bg-white border border-border rounded-sm space-y-4">
            <div className="flex items-baseline justify-between">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                Ready to run
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                Estimated cost
              </p>
            </div>

            <div className="flex items-baseline justify-between">
              <p className="text-sm font-medium">{resolvedUrl.replace(/^https?:\/\//, "")}</p>
              <p className="text-lg font-semibold tabular-nums">
                {estimateCost(activeText.length)}
              </p>
            </div>

            <div className="w-full h-px bg-border" />

            <div className="grid grid-cols-2 gap-4 text-xs text-muted">
              <div>
                <p className="mb-0.5">Text extracted</p>
                <p className="font-mono text-foreground">
                  {activeText.length.toLocaleString()} chars
                </p>
              </div>
              <div>
                <p className="mb-0.5">Model</p>
                <p className="font-mono text-foreground">Claude Sonnet</p>
              </div>
            </div>

            <p className="text-xs text-muted">
              This is an estimate based on current Anthropic API pricing ($3/M
              input, $15/M output tokens). Actual cost may vary slightly.
            </p>
          </div>

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleConfirm}
              className="inline-flex items-center h-11 px-6 text-sm font-medium bg-foreground text-background rounded-sm hover:bg-foreground/85 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Confirm and run
            </button>
            <button
              onClick={() => {
                setStep("input");
                setScrapedText("");
                setError("");
              }}
              className="inline-flex items-center h-11 px-4 text-sm text-muted hover:text-foreground transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {step === "paste" && (
        <div className="space-y-6 animate-fade-up">
          <div className="p-4 bg-accent-light rounded-sm border-l-4 border-accent">
            <p className="text-sm font-medium mb-1">
              Could not extract enough text from that URL
            </p>
            <p className="text-sm text-muted">
              {scrapedText
                ? "The site returned very little readable content (likely JavaScript-rendered or bot-protected)."
                : "The site could not be reached or returned an error."}{" "}
              Paste the homepage copy below instead.
            </p>
          </div>

          <div>
            <label
              htmlFor="paste"
              className="block font-mono text-[11px] uppercase tracking-[0.2em] text-muted mb-2"
            >
              Homepage copy
            </label>
            <textarea
              id="paste"
              rows={10}
              placeholder="Paste the main text content from the company's homepage here..."
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              className="w-full px-4 py-3 text-sm bg-white border border-border rounded-sm placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background resize-y"
            />
            <p className="mt-1.5 text-xs text-muted">
              Select all the visible text on the homepage and paste it here.
              Headers, body copy, CTAs. Skip the navigation and footer.
            </p>
          </div>

          {pastedText.trim().length >= 100 && (
            <div className="p-4 bg-white border border-border rounded-sm">
              <div className="flex items-baseline justify-between text-sm">
                <span className="text-muted">Estimated cost</span>
                <span className="font-semibold tabular-nums">
                  {estimateCost(pastedText.trim().length)}
                </span>
              </div>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <div className="flex gap-3">
            <button
              onClick={handlePasteSubmit}
              disabled={pastedText.trim().length < 100}
              className="inline-flex items-center h-11 px-6 text-sm font-medium bg-foreground text-background rounded-sm hover:bg-foreground/85 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Confirm and run
            </button>
            <button
              onClick={() => {
                setStep("input");
                setError("");
              }}
              className="inline-flex items-center h-11 px-4 text-sm text-muted hover:text-foreground transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Start over
            </button>
          </div>
        </div>
      )}

      {step === "synthesizing" && (
        <div className="text-center py-20 animate-fade-in">
          <svg
            className="w-8 h-8 mx-auto mb-4 animate-spin text-accent"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <p className="font-display text-xl mb-2">Running your audit</p>
          <p className="text-sm text-muted">
            This usually takes 15 to 30 seconds.
          </p>
        </div>
      )}

      <div className="mt-24">
        <Footer />
      </div>
    </div>
  );
}
