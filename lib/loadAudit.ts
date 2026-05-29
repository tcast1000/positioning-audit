import type { Audit } from "@/types/audit";
import { getAudit } from "@/lib/store";

const showcaseSlugs = ["linear", "notion", "vercel"];

export async function loadAudit(slug: string): Promise<Audit | null> {
  if (showcaseSlugs.includes(slug)) {
    try {
      const mod = await import(`@/content/showcase/${slug}.json`);
      return mod.default as Audit;
    } catch {
      // fall through to store
    }
  }

  return getAudit(slug);
}
