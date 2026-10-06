"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, ImagePlus, Check, ArrowLeft, ArrowRight } from "lucide-react";
import { createTrackerClient as createClient } from "@/lib/tracker/supabase";
import { compressImage } from "@/lib/tracker/image";
import { CameraCapture } from "./CameraCapture";
import { localDateIso } from "@/lib/tracker/dates";
import { ANGLES, PHOTO_BUCKET, SHEDDING_LABELS, type Angle } from "@/lib/tracker/config";

type Shot = { blob: Blob; preview: string };

export function NewCheckinForm({
  userId,
  reference,
}: {
  userId: string;
  reference: Partial<Record<Angle, string>>;
}) {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0..3 = angles, 4 = details
  const [shots, setShots] = useState<Partial<Record<Angle, Shot>>>({});
  const [takenOn, setTakenOn] = useState(localDateIso());
  const [shedding, setShedding] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Live camera with last month's photo overlaid, where the browser allows
  // it; otherwise (or if it fails) the phone's own camera via a file input.
  const [liveCamera, setLiveCamera] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  useEffect(() => {
    setLiveCamera(!!navigator.mediaDevices?.getUserMedia && window.isSecureContext);
  }, []);
  const closeCamera = useCallback(() => setCameraOpen(false), []);
  const cameraUnavailable = useCallback(() => {
    setCameraOpen(false);
    setLiveCamera(false);
    setError("Couldn't open the camera here. Use \"Take photo\" again to open your phone's camera instead.");
  }, []);

  const angle = ANGLES[step];
  const isDetails = step === ANGLES.length;
  const shotCount = Object.keys(shots).length;

  const setShot = (blob: Blob) => {
    if (!angle) return;
    const prev = shots[angle.id];
    if (prev) URL.revokeObjectURL(prev.preview);
    setShots({ ...shots, [angle.id]: { blob, preview: URL.createObjectURL(blob) } });
  };

  const onFile = async (file: File | undefined) => {
    if (!file || !angle) return;
    setError("");
    try {
      setShot(await compressImage(file));
    } catch {
      setError("Couldn't read that photo. Try a JPG or PNG.");
    }
  };

  const save = async () => {
    if (shotCount === 0) {
      setError("Add at least one photo.");
      return;
    }
    setBusy(true);
    setError("");
    const supabase = createClient();

    const { data: checkin, error: insertErr } = await supabase
      .from("tracker_checkins")
      .insert({ user_id: userId, taken_on: takenOn, shedding, notes: notes.trim() || null })
      .select("id")
      .single();

    if (insertErr || !checkin) {
      setBusy(false);
      setError(
        insertErr?.code === "42501"
          ? "You've reached the free plan limit. Upgrade to Pro to add more check-ins."
          : `Couldn't save: ${insertErr?.message ?? "unknown error"}`
      );
      return;
    }

    const uploaded: string[] = [];
    for (const [a, shot] of Object.entries(shots) as [Angle, Shot][]) {
      const path = `${userId}/${checkin.id}/${a}-${Date.now()}.jpg`;
      const { error: upErr } = await supabase.storage
        .from(PHOTO_BUCKET)
        .upload(path, shot.blob, { contentType: "image/jpeg" });
      const { error: rowErr } = upErr
        ? { error: upErr }
        : await supabase
            .from("tracker_photos")
            .insert({ checkin_id: checkin.id, user_id: userId, angle: a, storage_path: path });
      if (!upErr) uploaded.push(path);
      if (rowErr) {
        // Roll back so a failed save doesn't use up a free check-in.
        if (uploaded.length) await supabase.storage.from(PHOTO_BUCKET).remove(uploaded);
        await supabase.from("tracker_checkins").delete().eq("id", checkin.id);
        setBusy(false);
        setError(`Photo upload failed — please try again. (${rowErr.message})`);
        return;
      }
    }

    router.push("/tracker/app");
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-xl">
      {cameraOpen && angle && (
        <CameraCapture
          label={angle.label}
          reference={reference[angle.id]}
          onCapture={(blob) => {
            setShot(blob);
            setCameraOpen(false);
          }}
          onClose={closeCamera}
          onUnavailable={cameraUnavailable}
        />
      )}
      {/* Progress */}
      <ol className="mb-6 grid grid-cols-5 gap-1.5" aria-label="Check-in steps">
        {[...ANGLES.map((a) => a.label), "Details"].map((label, i) => (
          <li key={label}>
            <button
              onClick={() => setStep(i)}
              className={`h-1.5 w-full rounded-full ${
                i === step ? "bg-rl-primary" : i < ANGLES.length && shots[ANGLES[i].id] ? "bg-rl-primary/40" : "bg-slate-200"
              }`}
              aria-label={label}
              aria-current={i === step ? "step" : undefined}
            />
          </li>
        ))}
      </ol>

      {!isDetails && angle ? (
        <section className="rounded-2xl border border-rl-border bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-rl-primary">
            Photo {step + 1} of {ANGLES.length}
          </p>
          <h1 className="mt-1 text-xl font-semibold">{angle.label}</h1>
          <p className="mt-1 text-sm text-slate-600">{angle.tip}</p>
          <p className="mt-1 text-xs text-slate-500">
            Tip: same room, same lighting, dry hair, no product — every time.
          </p>

          <div className={`mt-4 grid gap-3 ${reference[angle.id] ? "grid-cols-2" : "grid-cols-1"}`}>
            {reference[angle.id] && (
              <figure>
                <img
                  src={reference[angle.id]}
                  alt="Your previous photo for this angle"
                  className="aspect-square w-full rounded-xl object-cover opacity-90"
                />
                <figcaption className="mt-1 text-center text-xs text-slate-500">Last time — match this</figcaption>
              </figure>
            )}
            <figure>
              {shots[angle.id] ? (
                <img
                  src={shots[angle.id]!.preview}
                  alt={`New ${angle.label} photo`}
                  className="aspect-square w-full rounded-xl object-cover"
                />
              ) : (
                <div className="flex aspect-square w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-rl-border text-slate-400">
                  <Camera className="h-10 w-10" aria-hidden />
                  <span className="mt-2 text-sm">No photo yet</span>
                </div>
              )}
              <figcaption className="mt-1 text-center text-xs text-slate-500">Today</figcaption>
            </figure>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {liveCamera ? (
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setCameraOpen(true);
                }}
                className="flex items-center justify-center gap-2 rounded-lg bg-rl-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-rl-primary-dark"
              >
                <Camera className="h-4 w-4" aria-hidden /> {shots[angle.id] ? "Retake" : "Take photo"}
              </button>
            ) : (
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-rl-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-rl-primary-dark">
                <Camera className="h-4 w-4" aria-hidden /> {shots[angle.id] ? "Retake" : "Take photo"}
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="sr-only"
                  onChange={(e) => {
                    onFile(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
              </label>
            )}
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-rl-border px-4 py-2.5 text-sm font-semibold hover:bg-slate-50">
              <ImagePlus className="h-4 w-4" aria-hidden /> Upload
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  onFile(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </label>
          </div>
        </section>
      ) : (
        <section className="rounded-2xl border border-rl-border bg-white p-5">
          <h1 className="text-xl font-semibold">A few quick details</h1>
          <p className="mt-1 text-sm text-slate-600">
            {shotCount} of {ANGLES.length} photos added.
          </p>

          <label className="mt-5 block text-sm">
            <span className="font-medium">Date</span>
            <input
              type="date"
              value={takenOn}
              max={localDateIso()}
              onChange={(e) => setTakenOn(e.target.value)}
              className="mt-1 w-full rounded-lg border border-rl-border px-3 py-2.5"
            />
          </label>

          <fieldset className="mt-5">
            <legend className="text-sm font-medium">Shedding this month</legend>
            <div className="mt-2 grid grid-cols-5 gap-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setShedding(shedding === n ? null : n)}
                  aria-pressed={shedding === n}
                  className={`rounded-lg border px-1 py-2 text-xs font-medium ${
                    shedding === n ? "border-rl-primary bg-rl-primary text-white" : "border-rl-border hover:bg-slate-50"
                  }`}
                >
                  {SHEDDING_LABELS[n]}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="mt-5 block text-sm">
            <span className="font-medium">Notes (optional)</span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              maxLength={1000}
              placeholder="New treatment, side effects, stress, haircut…"
              className="mt-1 w-full rounded-lg border border-rl-border px-3 py-2.5"
            />
          </label>
        </section>
      )}

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-4 flex items-center justify-between gap-3">
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0 || busy}
          className="flex items-center gap-1 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-white disabled:opacity-40"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden /> Back
        </button>
        {isDetails ? (
          <button
            onClick={save}
            disabled={busy}
            className="flex items-center gap-2 rounded-lg bg-rl-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-rl-primary-dark disabled:opacity-60"
          >
            <Check className="h-4 w-4" aria-hidden /> {busy ? "Saving…" : "Save check-in"}
          </button>
        ) : (
          <button
            onClick={() => setStep(step + 1)}
            className="flex items-center gap-1 rounded-lg px-4 py-2.5 text-sm font-semibold text-rl-primary hover:bg-white"
          >
            {angle && shots[angle.id] ? "Next" : "Skip"} <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        )}
      </div>
    </div>
  );
}
