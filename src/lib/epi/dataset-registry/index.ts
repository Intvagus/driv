import { DatasetDefinition, DatasetTypeId } from "@/types/epi/dataset";
import { ALL_DATASET_DEFINITIONS } from "./definitions";

/**
 * Central registry: adding a new EPI dataset type means adding one
 * DatasetDefinition here (or to definitions.ts) — no other code needs
 * to change for detection/mapping to pick it up.
 */
export const DatasetRegistry: Record<DatasetTypeId, DatasetDefinition> = Object.fromEntries(
  ALL_DATASET_DEFINITIONS.map((d) => [d.id, d]),
) as Record<DatasetTypeId, DatasetDefinition>;

export function getDatasetDefinition(id: DatasetTypeId): DatasetDefinition {
  const def = DatasetRegistry[id];
  if (!def) throw new Error(`Unknown dataset type: ${id}`);
  return def;
}

export function listDatasetDefinitions(): DatasetDefinition[] {
  return ALL_DATASET_DEFINITIONS;
}

export function listSupportedDatasetDefinitions(): DatasetDefinition[] {
  return ALL_DATASET_DEFINITIONS.filter((d) => d.status === "supported");
}

export { ALL_DATASET_DEFINITIONS };
