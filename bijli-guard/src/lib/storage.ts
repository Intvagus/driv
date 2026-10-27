// Everything the tracker knows lives in this phone's browser storage:
// no accounts, no server, nothing uploaded.

import type { Reading, TrackerSetup } from "./tracker";

const KEY = "bijli-guard-v1";

export type Saved = { setup: TrackerSetup; readings: Reading[] };

export function load(): Saved | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Saved;
    if (!data?.setup?.start || !Array.isArray(data.readings)) return null;
    return data;
  } catch {
    return null;
  }
}

export function save(data: Saved) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export function clear() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

export function todayIso() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
