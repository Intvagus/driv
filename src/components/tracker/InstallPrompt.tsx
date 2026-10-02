"use client";

import { useEffect, useState } from "react";
import { Share, Smartphone, X } from "lucide-react";
import { APP_NAME } from "@/lib/tracker/config";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "rootline-install-dismissed";

function readDismissed() {
  try {
    return localStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * "Add to home screen" card. Android/desktop Chrome get a real install
 * button; iPhone Safari (which has no install API) gets the two-tap
 * instructions. Hidden when already installed or dismissed.
 */
export function InstallPrompt() {
  const [mode, setMode] = useState<"hidden" | "native" | "ios">("hidden");
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (standalone || readDismissed()) return;

    const ua = navigator.userAgent;
    const isIos = /iPhone|iPad|iPod/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
    if (isIos) setMode("ios");

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setMode("native");
    };
    const onInstalled = () => setMode("hidden");
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // Private mode etc. — just hide for this visit.
    }
    setMode("hidden");
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    setDeferred(null);
    if (outcome === "accepted") setMode("hidden");
  };

  if (mode === "hidden") return null;

  return (
    <section className="relative flex items-start gap-3 rounded-2xl border border-rl-primary/30 bg-rl-primary/5 p-4 print:hidden">
      <Smartphone className="mt-0.5 h-5 w-5 shrink-0 text-rl-primary" aria-hidden />
      <div className="flex-1 pr-6 text-sm">
        <p className="font-semibold">Put {APP_NAME} on your home screen</p>
        {mode === "native" ? (
          <>
            <p className="mt-0.5 text-slate-600">Opens full-screen like a regular app — one tap to your monthly check-in.</p>
            <button
              onClick={install}
              className="mt-3 rounded-lg bg-rl-primary px-4 py-2 font-semibold text-white hover:bg-rl-primary-dark"
            >
              Install app
            </button>
          </>
        ) : (
          <p className="mt-0.5 text-slate-600">
            Tap <Share className="inline h-4 w-4 align-text-bottom" aria-label="Share" /> in Safari, then{" "}
            <strong>Add to Home Screen</strong>.
          </p>
        )}
      </div>
      <button
        onClick={dismiss}
        className="absolute right-2 top-2 rounded-md p-1.5 text-slate-400 hover:bg-white hover:text-slate-600"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" aria-hidden />
      </button>
    </section>
  );
}
