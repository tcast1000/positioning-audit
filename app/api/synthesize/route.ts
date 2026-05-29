import { NextRequest, NextResponse } from "next/server";
import { synthesize } from "@/lib/synthesize";
import { saveAudit, generateSlug } from "@/lib/store";

const rateLimit = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimit.get(ip) ?? [];
  const recent = timestamps.filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) return true;
  recent.push(now);
  rateLimit.set(ip, recent);
  return false;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Try again in a minute." },
      { status: 429 }
    );
  }

  let body: { url?: string; apiKey?: string; pastedText?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { url, apiKey, pastedText } = body;

  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "url is required" }, { status: 400 });
  }

  if (!apiKey || typeof apiKey !== "string") {
    return NextResponse.json(
      { error: "apiKey is required" },
      { status: 400 }
    );
  }

  if (!apiKey.startsWith("sk-ant-")) {
    return NextResponse.json(
      { error: "That doesn't look like an Anthropic API key" },
      { status: 400 }
    );
  }

  if (!pastedText || typeof pastedText !== "string" || pastedText.trim().length < 100) {
    return NextResponse.json(
      { error: "Website text is required (at least 100 characters)" },
      { status: 400 }
    );
  }

  try {
    const audit = await synthesize(apiKey, url, pastedText.trim());

    const slug = generateSlug(audit.company.name || "audit");
    await saveAudit(slug, audit);

    return NextResponse.json({ slug });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Synthesis failed";

    if (message.includes("authentication") || message.includes("401")) {
      return NextResponse.json(
        { error: "Invalid API key. Check your Anthropic key and try again." },
        { status: 401 }
      );
    }

    if (message.includes("rate") || message.includes("429")) {
      return NextResponse.json(
        { error: "Anthropic rate limit hit. Wait a moment and try again." },
        { status: 429 }
      );
    }

    if (message.includes("JSON") || message.includes("parse")) {
      return NextResponse.json(
        { error: "The model returned invalid output. Try again." },
        { status: 422 }
      );
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
