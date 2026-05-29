"use client";

import { useState, useRef, useEffect } from "react";

type Status = "idle" | "open" | "sending" | "sent" | "error";

export default function EmailButton({
  slug,
  companyName,
}: {
  slug: string;
  companyName: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === "open") {
      inputRef.current?.focus();
    }
  }, [status]);

  useEffect(() => {
    if (status === "sent") {
      const timer = setTimeout(() => {
        setStatus("idle");
        setEmail("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), slug, companyName }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong");
        setStatus("error");
        return;
      }

      setStatus("sent");
    } catch {
      setErrorMsg("Failed to send");
      setStatus("error");
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() =>
          setStatus((s) => (s === "idle" ? "open" : s === "error" ? "open" : "idle"))
        }
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm min-h-[44px] px-2"
        aria-label="Email this audit"
      >
        {status === "sent" ? (
          <>
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
                d="M5 13l4 4L19 7"
              />
            </svg>
            Sent
          </>
        ) : (
          <>
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
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Email
          </>
        )}
      </button>

      {(status === "open" || status === "sending" || status === "error") && (
        <form
          onSubmit={handleSend}
          className="absolute right-0 top-full mt-2 flex items-center gap-2 z-10 bg-background p-3 border border-border rounded-sm shadow-sm"
        >
          <input
            ref={inputRef}
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={status === "sending"}
            className="h-9 px-3 text-sm bg-white border border-border rounded-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 focus:ring-offset-background disabled:opacity-50 w-52"
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="h-9 px-4 text-sm font-medium bg-accent text-white rounded-sm hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50"
          >
            {status === "sending" ? (
              <svg
                className="w-4 h-4 animate-spin"
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
            ) : (
              "Send"
            )}
          </button>
          {status === "error" && errorMsg && (
            <span className="text-xs text-red-600">{errorMsg}</span>
          )}
        </form>
      )}
    </div>
  );
}
