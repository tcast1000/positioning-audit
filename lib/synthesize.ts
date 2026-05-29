import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "@/lib/prompt";
import type { Audit } from "@/types/audit";

const MODEL = process.env.CLAUDE_MODEL || "claude-sonnet-4-20250514";

function parseAuditJson(text: string): Audit {
  const cleaned = text.replace(/^```json?\s*/i, "").replace(/```\s*$/, "").trim();
  const parsed = JSON.parse(cleaned);

  if (!parsed.company?.name || !parsed.company?.url) {
    throw new Error("JSON missing company.name or company.url");
  }
  if (!parsed.current_positioning_summary) {
    throw new Error("JSON missing current_positioning_summary");
  }

  const d = parsed.dunford;
  if (
    !Array.isArray(d?.competitive_alternatives) || !d.competitive_alternatives.length ||
    !Array.isArray(d?.unique_attributes) || !d.unique_attributes.length ||
    !Array.isArray(d?.value) || !d.value.length ||
    !d?.best_fit_customer ||
    !d?.market_category
  ) {
    throw new Error("JSON missing dunford fields");
  }

  const dx = parsed.diagnosis;
  if (
    !Array.isArray(dx?.hedging) ||
    !Array.isArray(dx?.contradictions) ||
    !Array.isArray(dx?.missing) ||
    !dx?.first_change
  ) {
    throw new Error("JSON missing diagnosis fields");
  }

  const rw = parsed.rewrite;
  if (!rw?.current_headline || !rw?.sharper_headline || !rw?.current_subhead || !rw?.sharper_subhead) {
    throw new Error("JSON missing rewrite fields");
  }

  if (!parsed.generated_at) {
    parsed.generated_at = new Date().toISOString();
  }

  return parsed as Audit;
}

export async function synthesize(
  apiKey: string,
  companyUrl: string,
  websiteText: string
): Promise<Audit> {
  const client = new Anthropic({ apiKey });

  const userMessage = `Company URL: ${companyUrl}\n\nWebsite copy:\n${websiteText.slice(0, 12000)}`;

  let response = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userMessage }],
  });

  const firstContent = response.content[0];
  if (firstContent.type !== "text") {
    throw new Error("Unexpected response type from Claude");
  }

  try {
    return parseAuditJson(firstContent.text);
  } catch {
    // Retry once with explicit JSON instruction
    response = await client.messages.create({
      model: MODEL,
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        { role: "user", content: userMessage },
        { role: "assistant", content: firstContent.text },
        {
          role: "user",
          content:
            "That was not valid JSON. Return ONLY the JSON object matching the Audit schema. No markdown, no commentary.",
        },
      ],
    });

    const retryContent = response.content[0];
    if (retryContent.type !== "text") {
      throw new Error("Unexpected response type on retry");
    }

    return parseAuditJson(retryContent.text);
  }
}
