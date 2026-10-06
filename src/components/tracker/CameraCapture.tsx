"use client";

import { useEffect, useRef, useState } from "react";
import { Eye, EyeOff, SwitchCamera, X } from "lucide-react";
import { captureVideoFrame } from "@/lib/tracker/image";

type Facing = "environment" | "user";

/**
 * Full-screen live camera with last month's photo laid over it, so the new
 * shot can be lined up with the old one. The preview is a centre square,
 * like the comparison views, and is not mirrored, so what you line up is
 * exactly what gets compared. Calls onUnavailable if the camera can't be
 * opened (no permission, no camera, insecure context) so the caller can fall
 * back to the system camera.
 */
export function CameraCapture({
  label,
  reference,
  onCapture,
  onClose,
  onUnavailable,
}: {
  label: string;
  reference?: string;
  onCapture: (blob: Blob) => void;
  onClose: () => void;
  onUnavailable: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [facing, setFacing] = useState<Facing>("environment");
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [ghost, setGhost] = useState(35); // overlay opacity, %
  const [showGhost, setShowGhost] = useState(true);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let cancelled = false;
    setReady(false);

    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: facing }, width: { ideal: 1920 }, height: { ideal: 1920 } },
          audio: false,
        });
        if (cancelled) return stream.getTracks().forEach((t) => t.stop());
        const video = videoRef.current;
        if (!video) return;
        video.srcObject = stream;
        await video.play();
        setReady(true);
      } catch (err) {
        console.error("Camera unavailable", err);
        if (!cancelled) onUnavailable();
      }
    })();

    return () => {
      cancelled = true;
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [facing, onUnavailable]);

  // Close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const shoot = async () => {
    const video = videoRef.current;
    if (!video || !ready) return;
    setBusy(true);
    try {
      onCapture(await captureVideoFrame(video));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div role="dialog" aria-modal="true" aria-label={`Camera: ${label}`} className="fixed inset-0 z-50 flex flex-col bg-black text-white">
      <div className="flex items-center justify-between px-4 pb-2 pt-[max(1rem,env(safe-area-inset-top))]">
        <p className="text-sm font-semibold">{label}</p>
        <button onClick={onClose} className="rounded-full p-2 hover:bg-white/10" aria-label="Close camera">
          <X className="h-5 w-5" aria-hidden />
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center px-4">
        <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-2xl bg-neutral-900">
          <video ref={videoRef} playsInline muted className="absolute inset-0 h-full w-full object-cover" />
          {reference && showGhost && (
            <img
              src={reference}
              alt=""
              className="pointer-events-none absolute inset-0 h-full w-full object-cover"
              style={{ opacity: ghost / 100 }}
            />
          )}
          {/* Thirds grid helps keep the head level between months. */}
          <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <span key={i} className="border border-white/15" />
            ))}
          </div>
          {!ready && (
            <p className="absolute inset-0 flex items-center justify-center text-sm text-white/70">Starting camera…</p>
          )}
        </div>
      </div>

      <div className="space-y-4 px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4">
        {reference ? (
          <div className="mx-auto flex max-w-md items-center gap-3">
            <button
              onClick={() => setShowGhost(!showGhost)}
              className="rounded-full p-2 hover:bg-white/10"
              aria-pressed={showGhost}
              aria-label={showGhost ? "Hide last month's photo" : "Show last month's photo"}
            >
              {showGhost ? <Eye className="h-5 w-5" aria-hidden /> : <EyeOff className="h-5 w-5" aria-hidden />}
            </button>
            <label className="flex flex-1 items-center gap-3 text-xs text-white/80">
              <span className="shrink-0">Last month</span>
              <input
                type="range"
                min={10}
                max={70}
                value={ghost}
                onChange={(e) => setGhost(Number(e.target.value))}
                disabled={!showGhost}
                className="w-full accent-white"
                aria-label="Overlay strength"
              />
            </label>
          </div>
        ) : (
          <p className="text-center text-xs text-white/70">
            First photo for this angle. Next month it will appear here as a guide.
          </p>
        )}

        <div className="mx-auto flex max-w-md items-center justify-between">
          <span className="w-12" />
          <button
            onClick={shoot}
            disabled={!ready || busy}
            className="h-16 w-16 rounded-full border-4 border-white bg-white/90 transition active:scale-95 disabled:opacity-40"
            aria-label="Take photo"
          />
          <button
            onClick={() => setFacing(facing === "environment" ? "user" : "environment")}
            className="rounded-full p-3 hover:bg-white/10"
            aria-label="Switch camera"
          >
            <SwitchCamera className="h-6 w-6" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
