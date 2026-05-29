"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "audit-history";
const MAX_ENTRIES = 20;

export type AuditHistoryEntry = {
  slug: string;
  companyName: string;
  companyUrl: string;
  generatedAt: string;
};

/* ------------------------------------------------------------------ */
/*  Thin pub/sub so every hook instance re-renders on the same write  */
/* ------------------------------------------------------------------ */

const listeners = new Set<() => void>();
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
function emitChange() {
  for (const cb of listeners) cb();
}

/* ------------------------------------------------------------------ */
/*  Raw read / write helpers (SSR-safe)                               */
/* ------------------------------------------------------------------ */

function readEntries(): AuditHistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuditHistoryEntry[]) : [];
  } catch {
    return [];
  }
}

function writeEntries(entries: AuditHistoryEntry[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  emitChange();
}

/* ------------------------------------------------------------------ */
/*  Snapshot for useSyncExternalStore                                 */
/* ------------------------------------------------------------------ */

let cachedSnapshot: AuditHistoryEntry[] = [];

function getSnapshot(): AuditHistoryEntry[] {
  if (typeof window === "undefined") return cachedSnapshot;
  const raw = localStorage.getItem(STORAGE_KEY);
  const parsed: AuditHistoryEntry[] = raw ? JSON.parse(raw) : [];
  // Only update reference when content actually changed
  if (JSON.stringify(parsed) !== JSON.stringify(cachedSnapshot)) {
    cachedSnapshot = parsed;
  }
  return cachedSnapshot;
}

function getServerSnapshot(): AuditHistoryEntry[] {
  return [];
}

/* ------------------------------------------------------------------ */
/*  Hook                                                              */
/* ------------------------------------------------------------------ */

export function useAuditHistory() {
  const history = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const addAudit = useCallback((entry: AuditHistoryEntry) => {
    const current = readEntries();
    const deduped = current.filter((e) => e.slug !== entry.slug);
    const next = [entry, ...deduped].slice(0, MAX_ENTRIES);
    writeEntries(next);
  }, []);

  const getHistory = useCallback((): AuditHistoryEntry[] => {
    return readEntries();
  }, []);

  const clearHistory = useCallback(() => {
    writeEntries([]);
  }, []);

  return { history, addAudit, getHistory, clearHistory };
}
