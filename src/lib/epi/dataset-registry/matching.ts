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

function scoreHeader(col: ColumnDefinition, header: string): number {
  const candidates = [col.label, ...col.aliases].map(normalizeHeader);
  const normHeader = normalizeHeader(header);
  if (!normHeader) return 0;
  let score = 0;
  for (const candidate of candidates) {
    if (normHeader === candidate) {
      score = Math.max(score, 1);
    } else if (candidate.length >= 3 && (normHeader.includes(candidate) || candidate.includes(normHeader))) {
      score = Math.max(score, 0.8);
    } else if (normHeader.split(" ").some((tok) => candidate.split(" ").includes(tok) && tok.length >= 3)) {
      score = Math.max(score, 0.55);
    }
  }
  return score;
}

/** Best matching uploaded header for one column definition, ignoring any competition from other columns. */
export function findBestHeaderMatch(col: ColumnDefinition, headers: string[]): HeaderMatch | null {
  let best: HeaderMatch | null = null;
  for (const header of headers) {
    const score = scoreHeader(col, header);
    if (score > 0 && (!best || score > best.confidence)) {
      best = { header, confidence: score };
    }
  }
  return best;
}

/** All plausible header matches for one column definition, sorted best-first. */
export function findAllHeaderMatches(col: ColumnDefinition, headers: string[]): HeaderMatch[] {
  return headers
    .map((header) => ({ header, confidence: scoreHeader(col, header) }))
    .filter((m) => m.confidence > 0)
    .sort((a, b) => b.confidence - a.confidence);
}
