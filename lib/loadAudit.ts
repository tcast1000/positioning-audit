import type { Audit } from "@/types/audit";
import { getAudit } from "@/lib/store";

const showcaseSlugs = ["linear", "notion", "vercel"];

function isValidAudit(data: unknown): data is Audit {
  if (!data || typeof data !== "object") return false;
  const a = data as Record<string, unknown>;

  const company = a.company as Record<string, unknown> | undefined;
  if (!company?.name || !company?.url) return false;

  if (typeof a.current_positioning_summary !== "string") return false;

  const d = a.dunford as Record<string, unknown> | undefined;
  if (
    !Array.isArray(d?.competitive_alternatives) ||
    !Array.isArray(d?.unique_attributes) ||
    !Array.isArray(d?.value) ||
    typeof d?.best_fit_customer !== "string" ||
    typeof d?.market_category !== "string"
  ) return false;

  const dx = a.diagnosis as Record<string, unknown> | undefined;
  if (
    !Array.isArray(dx?.hedging) ||
    !Array.isArray(dx?.contradictions) ||
    !Array.isArray(dx?.missing) ||
    typeof dx?.first_change !== "string"
  ) return false;

  const rw = a.rewrite as Record<string, unknown> | undefined;
  if (
    typeof rw?.current_headline !== "string" ||
    typeof rw?.sharper_headline !== "string" ||
    typeof rw?.current_subhead !== "string" ||
    typeof rw?.sharper_subhead !== "string"
  ) return false;

  return true;
}

export async function loadAudit(slug: string): Promise<Audit | null> {
  if (showcaseSlugs.includes(slug)) {
    try {
      const mod = await import(`@/content/showcase/${slug}.json`);
      return mod.default as Audit;
    } catch {
      // fall through to store
    }
  }

  const audit = await getAudit(slug);
  if (!audit || !isValidAudit(audit)) return null;

  return audit;
}
