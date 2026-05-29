import * as cheerio from "cheerio";

export async function scrapeUrl(url: string): Promise<string> {
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

  const html = await res.text();
  const $ = cheerio.load(html);

  $("script, style, noscript, nav, footer, header, svg, iframe").remove();
  $("[aria-hidden='true']").remove();

  const text = $("main, article, [role='main'], body")
    .first()
    .text()
    .replace(/\s+/g, " ")
    .trim();

  return text;
}

export const MIN_SCRAPE_LENGTH = 400;
