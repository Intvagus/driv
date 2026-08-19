import { ColumnDefinition } from "@/types/epi/dataset";

/** Normalizes a header/alias for tolerant comparison: case, punctuation, spacing. */
export function normalizeHeader(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[_\-./]+/g, " ")
    .replace(/[^a-z0-9% ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export interface HeaderMatch {
  header: string;
  confidence: number;
}

/** Best matching uploaded header for one column definition, or null if nothing plausible. */
export function findBestHeaderMatch(col: ColumnDefinition, headers: string[]): HeaderMatch | null {
  const candidates = [col.label, ...col.aliases].map(normalizeHeader);
  let best: HeaderMatch | null = null;

  for (const header of headers) {
    const normHeader = normalizeHeader(header);
    if (!normHeader) continue;
    let score = 0;
    for (const candidate of candidates) {
      if (normHeader === candidate) {
        score = Math.max(score, 1);
      } else if (candidate.length >= 3 && (normHeader.includes(candidate) || candidate.includes(normHeader))) {
        score = Math.max(score, 0.8);
      } else if (
        normHeader.split(" ").some((tok) => candidate.split(" ").includes(tok) && tok.length >= 3)
      ) {
        score = Math.max(score, 0.55);
      }
    }
    if (score > 0 && (!best || score > best.confidence)) {
      best = { header, confidence: score };
    }
  }
  return best;
}
