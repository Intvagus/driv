import { APP_NAME } from "@/lib/tracker/config";

export function RootlineLogo() {
  return (
    <span className="flex items-center gap-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rl-primary text-sm font-bold text-white">
        R
      </span>
      <span className="text-base font-semibold tracking-tight text-rl-ink">{APP_NAME}</span>
    </span>
  );
}
