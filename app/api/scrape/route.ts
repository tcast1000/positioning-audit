import { NextRequest, NextResponse } from "next/server";
import { scrapeUrl, MIN_SCRAPE_LENGTH } from "@/lib/scrape";

export async function POST(req: NextRequest) {
  let body: { url?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { url } = body;
  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "url is required" }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return NextResponse.json({ error: "URL must use http or https" }, { status: 400 });
  }

  try {
    const text = await scrapeUrl(parsed.href);
    const sufficient = text.length >= MIN_SCRAPE_LENGTH;
    return NextResponse.json({ text, sufficient });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Scrape failed";
    return NextResponse.json({ text: "", sufficient: false, error: message });
  }
}
