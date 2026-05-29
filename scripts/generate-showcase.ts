import Anthropic from "@anthropic-ai/sdk";
import * as cheerio from "cheerio";
import { writeFileSync } from "fs";
import { join } from "path";

const SYSTEM_PROMPT = `You are a senior B2B SaaS product marketing manager running a positioning audit on a company using only its website copy. You write like a real PMM talking straight to a founder. Direct, specific, opinionated. Not a chatbot, not a consultant hedging every sentence.

Your structural backbone is April Dunford's positioning framework from Obviously Awesome: competitive alternatives, unique attributes, value, best-fit customers, and market category. Use these components to organize your thinking, but do not just fill in blanks. Diagnose what is weak and commit to a recommendation.

Analysis rules:
- Work only from the supplied website text. If something is not stated, mark it missing rather than inventing it.
- Competitive alternatives means what the customer would do if this product did not exist, not only named competitors.
- Unique attributes are concrete capabilities or features, not adjectives.
- Value connects each attribute to an outcome the best-fit customer actually cares about.
- The diagnosis is where you earn your keep. Name the hedging language, the internal contradictions, and the single highest-leverage change.
- The rewrite must be usable as is. A sharper headline and subhead, not a description of what a better one would do.

Voice rules:
- No em dashes.
- No filler verbs or adjectives. Ban leverage, robust, seamless, empower, unlock, elevate, cutting-edge, best-in-class.
- Short declarative sentences. Specific beats generic every time.

Output rules:
- Return ONLY a single valid JSON object matching the Audit schema. No markdown fences, no preamble, no closing commentary.
- Arrays hold 2 to 5 items. Strings are tight, one to three sentences.`;

const TARGETS = [
  { slug: "linear", url: "https://linear.app" },
  { slug: "notion", url: "https://notion.so" },
  { slug: "vercel", url: "https://vercel.com" },
];

async function scrape(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; PositioningAuditBot/1.0; +https://tools.teddycastro.me)",
    },
    redirect: "follow",
  });
  const html = await res.text();
  const $ = cheerio.load(html);
  $("script, style, noscript, nav, footer, header, svg, iframe").remove();
  return $("body").text().replace(/\s+/g, " ").trim();
}

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("Set ANTHROPIC_API_KEY in your environment.");
    process.exit(1);
  }

  const client = new Anthropic({ apiKey });
  const outDir = join(process.cwd(), "content", "showcase");

  for (const target of TARGETS) {
    console.log(`\nProcessing ${target.slug} (${target.url})...`);

    const text = await scrape(target.url);
    console.log(`  Scraped ${text.length} chars`);

    const response = await client.messages.create({
      model: process.env.CLAUDE_MODEL || "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Company URL: ${target.url}\n\nWebsite copy:\n${text.slice(0, 12000)}`,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== "text") throw new Error("Unexpected response type");

    const cleaned = content.text
      .replace(/^```json?\s*/i, "")
      .replace(/```\s*$/, "")
      .trim();
    const audit = JSON.parse(cleaned);

    const outPath = join(outDir, `${target.slug}.json`);
    writeFileSync(outPath, JSON.stringify(audit, null, 2) + "\n");
    console.log(`  Wrote ${outPath}`);
  }

  console.log("\nDone.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
