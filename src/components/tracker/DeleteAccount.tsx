"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";

export function DeleteAccount() {
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<{ message: string; portalUrl?: string | null } | null>(null);

  const onDelete = async () => {
    setBusy(true);
    setError(null);
    const res = await fetch("/api/tracker/account/delete", { method: "POST" });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      setBusy(false);
      setError({ message: body.error ?? "Something went wrong. Please try again.", portalUrl: body.portalUrl });
      return;
    }
    window.location.href = `/tracker?deleted=${body.loginKept ? "data" : "account"}`;
  };

  return (
    <section className="rounded-2xl border border-red-200 bg-white p-5 text-sm">
      <h2 className="font-semibold text-red-700">Delete account</h2>
      <p className="mt-1 text-slate-600">
        Permanently deletes all your photos, check-ins, treatments and settings. This can&apos;t be undone.
      </p>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="mt-3 rounded-lg border border-red-300 px-4 py-2 font-semibold text-red-700 hover:bg-red-50"
        >
          Delete my account…
        </button>
      ) : (
        <div className="mt-3 space-y-3">
          <p className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-red-800">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            If you have Pro, it will be cancelled. Want a copy first? Use the Report page to save your photos as a PDF.
          </p>
          <label className="block">
            <span className="text-slate-700">
              Type <strong>DELETE</strong> to confirm
            </span>
            <input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              autoComplete="off"
              className="mt-1 w-full rounded-lg border border-rl-border px-3 py-2.5"
            />
          </label>
          {error && (
            <p className="text-red-600">
              {error.message}{" "}
              {error.portalUrl && (
                <a href={error.portalUrl} className="font-medium underline">
                  Manage billing
                </a>
              )}
            </p>
          )}
          <div className="flex gap-2">
            <button
              onClick={onDelete}
              disabled={confirmText !== "DELETE" || busy}
              className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
            >
              {busy ? "Deleting…" : "Permanently delete"}
            </button>
            <button
              onClick={() => {
                setOpen(false);
                setConfirmText("");
                setError(null);
              }}
              className="rounded-lg px-4 py-2 font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
