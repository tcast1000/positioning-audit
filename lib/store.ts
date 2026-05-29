import { Redis } from "@upstash/redis";
import type { Audit } from "@/types/audit";

const TTL_SECONDS = 30 * 24 * 60 * 60; // 30 days

let redis: Redis | null = null;
let memoryStore: Map<string, Audit> | null = null;
let warned = false;

function getRedis() {
  if (redis) return redis;

  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (url && token) {
    redis = new Redis({ url, token });
    return redis;
  }

  if (!warned) {
    console.warn(
      "[store] UPSTASH_REDIS_REST_URL/TOKEN not set. Using in-memory store. Data will not persist across restarts."
    );
    warned = true;
  }

  return null;
}

function getMemoryStore() {
  if (!memoryStore) {
    memoryStore = new Map();
  }
  return memoryStore;
}

export async function saveAudit(slug: string, audit: Audit): Promise<void> {
  const r = getRedis();
  if (r) {
    await r.set(`audit:${slug}`, JSON.stringify(audit), { ex: TTL_SECONDS });
  } else {
    getMemoryStore().set(slug, audit);
  }
}

export async function getAudit(slug: string): Promise<Audit | null> {
  const r = getRedis();
  if (r) {
    const data = await r.get<string>(`audit:${slug}`);
    if (!data) return null;
    return typeof data === "string" ? JSON.parse(data) : (data as Audit);
  }
  return getMemoryStore().get(slug) ?? null;
}

export function generateSlug(companyName: string): string {
  const base = companyName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 30);
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${base}-${suffix}`;
}
