import { APP_NAME } from "@/lib/tracker/config";

export function RootlineLogo() {
  return (
    <span className="flex items-center gap-2">
      <img src="/tracker/icons/icon-192.png" alt="" width={32} height={32} className="h-8 w-8 rounded-lg" />
      <span className="text-base font-semibold tracking-tight text-rl-ink">{APP_NAME}</span>
    </span>
  );
}
