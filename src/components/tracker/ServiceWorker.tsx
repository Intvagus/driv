"use client";

import { useEffect } from "react";

/** Registers the tracker service worker (production only, so dev reloads stay fresh). */
export function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/tracker/sw.js", { scope: "/tracker/" }).catch((err) => {
      console.error("Service worker registration failed", err);
    });
  }, []);
  return null;
}
