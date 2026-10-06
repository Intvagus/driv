import Link from "next/link";
import { RootlineLogo } from "./Logo";

export function GuidesHeader() {
  return (
    <header className="border-b border-rl-border bg-white">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <Link href="/tracker">
          <RootlineLogo />
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/tracker/guides" className="text-slate-600 hover:text-rl-ink">
            Guides
          </Link>
          <Link
            href="/tracker/login?mode=signup"
            className="rounded-lg bg-rl-primary px-4 py-2 font-semibold text-white hover:bg-rl-primary-dark"
          >
            Start free
          </Link>
        </nav>
      </div>
    </header>
  );
}
