"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Camera, Columns2, Pill, FileText, LogOut } from "lucide-react";
import { createTrackerClient as createClient } from "@/lib/tracker/supabase";
import { RootlineLogo } from "./Logo";

const LINKS = [
  { href: "/tracker/app", label: "Home", icon: LayoutDashboard },
  { href: "/tracker/app/new", label: "Check-in", icon: Camera },
  { href: "/tracker/app/compare", label: "Compare", icon: Columns2 },
  { href: "/tracker/app/treatments", label: "Treatments", icon: Pill },
  { href: "/tracker/app/report", label: "Report", icon: FileText },
];

export function AppNav({ isPro }: { isPro: boolean }) {
  const pathname = usePathname();
  const router = useRouter();

  const signOut = async () => {
    await createClient().auth.signOut();
    router.push("/tracker");
    router.refresh();
  };

  return (
    <>
      <header className="border-b border-rl-border bg-white print:hidden">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link href="/tracker/app" className="flex items-center gap-2">
            <RootlineLogo />
            {isPro && (
              <span className="rounded-full bg-rl-accent/10 px-2 py-0.5 text-xs font-semibold text-rl-accent">PRO</span>
            )}
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`rounded-md px-3 py-2 text-sm font-medium ${
                  pathname === href ? "bg-rl-primary/10 text-rl-primary" : "text-slate-600 hover:text-rl-ink"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
          <button
            onClick={signOut}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-rl-ink"
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </header>
      {/* Mobile bottom tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-rl-border bg-white pb-[env(safe-area-inset-bottom)] md:hidden print:hidden">
        {LINKS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium ${
              pathname === href ? "text-rl-primary" : "text-slate-500"
            }`}
          >
            <Icon className="h-5 w-5" aria-hidden />
            {label}
          </Link>
        ))}
      </nav>
    </>
  );
}
