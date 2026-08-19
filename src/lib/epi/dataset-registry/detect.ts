import { DatasetDetectionCandidate, DatasetDetectionRule, DetectionResult } from "@/types/epi/dataset";
import { listDatasetDefinitions } from "./index";
import { findBestHeaderMatch } from "./matching";

export const DETECTION_CONFIDENCE_THRESHOLD = 0.75;
const HEADER_MATCH_THRESHOLD = 0.5;

function scoreDataset(rule: DatasetDetectionRule, columnMatches: Map<string, number>): number {
  const strong = rule.strongSignals;
  const support = rule.supportingSignals;

  const strongMatched = strong.filter((k) => (columnMatches.get(k) ?? 0) >= HEADER_MATCH_THRESHOLD).length;
  const supportMatched = support.filter((k) => (columnMatches.get(k) ?? 0) >= HEADER_MATCH_THRESHOLD).length;

  const strongScore = strong.length > 0 ? strongMatched / strong.length : 0;
  const supportScore = support.length > 0 ? supportMatched / support.length : 0;

  if (strong.length === 0) return supportScore;
  return strongScore * 0.7 + supportScore * 0.3;
}

/**
 * Compares uploaded headers against every registered dataset definition and
 * returns confidence-ranked candidates. Never silently assumes: callers
 * must check `isConfident` and prompt the user to choose when false.
 */
export function detectDataset(headers: string[]): DetectionResult {
  const candidates: DatasetDetectionCandidate[] = listDatasetDefinitions().map((def) => {
    const columnMatches = new Map<string, number>();
    for (const col of def.columns) {
      const match = findBestHeaderMatch(col, headers);
      columnMatches.set(col.key, match?.confidence ?? 0);
    }
    const confidence = scoreDataset(def.detection, columnMatches);

    const matchedFields = def.columns
      .filter((c) => c.required || def.detection.strongSignals.includes(c.key) || def.detection.supportingSignals.includes(c.key))
      .map((c) => ({
        key: c.key,
        label: c.label,
        matched: (columnMatches.get(c.key) ?? 0) >= HEADER_MATCH_THRESHOLD,
      }));

    return {
      datasetId: def.id,
      name: def.name,
      confidence: Math.round(confidence * 100) / 100,
      matchedFields,
    };
  });

  candidates.sort((a, b) => b.confidence - a.confidence);
  const best = candidates[0] ?? null;

  return {
    candidates,
    best,
    isConfident: !!best && best.confidence >= DETECTION_CONFIDENCE_THRESHOLD,
  };
}
