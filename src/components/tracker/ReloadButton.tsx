"use client";

export function ReloadButton() {
  return (
    <button
      onClick={() => window.location.reload()}
      className="mt-5 w-full rounded-lg bg-rl-primary py-2.5 font-semibold text-white hover:bg-rl-primary-dark"
    >
      Try again
    </button>
  );
}
