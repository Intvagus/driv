"use client";

import { useEffect } from "react";
import { ADSENSE_CLIENT } from "@/lib/site";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * Responsive AdSense unit. Renders nothing until NEXT_PUBLIC_ADSENSE_CLIENT
 * and a slot id are set, so the site looks clean before AdSense approval.
 */
export function AdSlot({ slot, className = "" }: { slot?: string; className?: string }) {
  useEffect(() => {
    if (!ADSENSE_CLIENT || !slot) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Ad blocked or script not loaded yet.
    }
  }, [slot]);

  if (!ADSENSE_CLIENT || !slot) return null;
  return (
    <div className={`my-6 min-h-[100px] ${className}`} aria-label="Advertisement">
      <ins
        className="adsbygoogle block"
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
