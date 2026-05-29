import * as cheerio from "cheerio";

const BLOCKED_HOSTS = [
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "[::1]",
  "metadata.google.internal",
];

const PRIVATE_IP_PREFIXES = [
  "10.",
  "172.16.", "172.17.", "172.18.", "172.19.",
  "172.20.", "172.21.", "172.22.", "172.23.",
  "172.24.", "172.25.", "172.26.", "172.27.",
  "172.28.", "172.29.", "172.30.", "172.31.",
  "192.168.",
  "169.254.",
];

function isBlockedUrl(url: string): boolean {
  const parsed = new URL(url);
  const host = parsed.hostname.toLowerCase();

  if (BLOCKED_HOSTS.includes(host)) return true;
  if (PRIVATE_IP_PREFIXES.some((p) => host.startsWith(p))) return true;
  if (parsed.port && parsed.port !== "80" && parsed.port !== "443") return true;

  return false;
}

const MAX_BODY_BYTES = 2 * 1024 * 1024; // 2 MB

export async function scrapeUrl(url: string): Promise<string> {
  if (isBlockedUrl(url)) {
    throw new Error("URL points to a blocked address");
  }

  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; PositioningAuditBot/1.0; +https://tools.teddycastro.me)",
      Accept: "text/html,application/xhtml+xml",
    },
    redirect: "follow",
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  }

  const contentLength = res.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > MAX_BODY_BYTES) {
    throw new Error("Response too large");
  }

  const buffer = await res.arrayBuffer();
  if (buffer.byteLength > MAX_BODY_BYTES) {
    throw new Error("Response too large");
  }

  const html = new TextDecoder().decode(buffer);
  const $ = cheerio.load(html);

  $("script, style, noscript, nav, footer, svg, iframe").remove();
  $("[aria-hidden='true']").remove();

  const text = $("main, article, [role='main'], body")
    .first()
    .text()
    .replace(/\s+/g, " ")
    .trim();

  return text;
}

export const MIN_SCRAPE_LENGTH = 400;
