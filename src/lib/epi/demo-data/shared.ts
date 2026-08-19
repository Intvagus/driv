export const DEMO_DISTRICTS = ["Alderbrook", "Bellmoor", "Cedarfield", "Dunwich", "Eastgate", "Fenwick", "Greenholt", "Harrowden"];

export const DEMO_TEHSILS: Record<string, string[]> = {
  Alderbrook: ["Alderbrook North", "Alderbrook South"],
  Bellmoor: ["Bellmoor Central"],
  Cedarfield: ["Cedarfield East", "Cedarfield West"],
  Dunwich: ["Dunwich Town"],
  Eastgate: ["Eastgate Hills"],
  Fenwick: ["Fenwick Vale"],
  Greenholt: ["Greenholt Ridge"],
  Harrowden: ["Harrowden Plains"],
};

// Simple deterministic pseudo-random generator so demo data is stable across runs.
export function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function pick<T>(arr: T[], rnd: () => number): T {
  return arr[Math.floor(rnd() * arr.length)];
}
