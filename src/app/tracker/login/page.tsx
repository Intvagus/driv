"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { MailCheck } from "lucide-react";
import { createTrackerClient as createClient } from "@/lib/tracker/supabase";
import { RootlineLogo } from "@/components/tracker/Logo";

export default function TrackerLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const params = useSearchParams();
  const router = useRouter();
  const plan = params.get("plan");
  // Where to land after auth: straight to checkout if they picked a paid plan.
  const next = plan === "monthly" || plan === "yearly" ? `/api/tracker/checkout?plan=${plan}` : "/tracker/app";

  const [mode, setMode] = useState<"signin" | "signup">(params.get("mode") === "signup" ? "signup" : "signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkEmail, setCheckEmail] = useState(false);

  const go = (path: string) => {
    // Checkout is an API redirect, so it needs a full navigation.
    if (path.startsWith("/api/")) window.location.href = path;
    else router.push(path);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const emailRedirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;

    if (mode === "signup") {
      const { data, error: err } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo },
      });
      if (err) setError(err.message);
      else if (data.session) go(next);
      else setCheckEmail(true); // email confirmation is on
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) setError(err.message);
      else go(next);
    }
    setLoading(false);
  };

  const sendMagicLink = async () => {
    if (!email) {
      setError("Enter your email first.");
      return;
    }
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    if (err) setError(err.message);
    else setCheckEmail(true);
    setLoading(false);
  };

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <Link href="/tracker" className="mb-8 flex justify-center">
          <RootlineLogo />
        </Link>
        <div className="rounded-2xl border border-rl-border bg-white p-6 shadow-sm">
          {checkEmail ? (
            <div className="text-center">
              <MailCheck className="mx-auto h-12 w-12 text-rl-primary" aria-hidden />
              <h1 className="mt-3 text-xl font-semibold">Check your email</h1>
              <p className="mt-2 text-sm text-slate-600">
                We sent a link to <strong>{email}</strong>. Open it on this device to continue.
              </p>
              <button onClick={() => setCheckEmail(false)} className="mt-4 text-sm text-rl-primary hover:underline">
                Use a different email
              </button>
            </div>
          ) : (
            <>
              <h1 className="text-center text-xl font-semibold">
                {mode === "signup" ? "Create your free account" : "Welcome back"}
              </h1>
              {plan && mode === "signup" && (
                <p className="mt-1 text-center text-xs text-slate-500">
                  You&apos;ll go to secure checkout right after sign-up.
                </p>
              )}
              <form onSubmit={onSubmit} className="mt-6 space-y-3">
                <label className="block text-sm">
                  <span className="text-slate-700">Email</span>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-rl-border px-3 py-2.5 outline-none focus:border-rl-primary focus:ring-2 focus:ring-rl-primary/20"
                  />
                </label>
                <label className="block text-sm">
                  <span className="text-slate-700">Password</span>
                  <input
                    type="password"
                    required
                    minLength={8}
                    autoComplete={mode === "signup" ? "new-password" : "current-password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-rl-border px-3 py-2.5 outline-none focus:border-rl-primary focus:ring-2 focus:ring-rl-primary/20"
                  />
                </label>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-rl-primary py-2.5 font-semibold text-white hover:bg-rl-primary-dark disabled:opacity-60"
                >
                  {loading ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
                </button>
              </form>
              {mode === "signup" && (
                <p className="mt-3 text-center text-xs text-slate-500">
                  By creating an account you agree to the{" "}
                  <Link href="/tracker/terms" className="underline">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link href="/tracker/privacy" className="underline">
                    Privacy Policy
                  </Link>
                  , including how we handle your photos and health information.
                </p>
              )}
              <button
                type="button"
                onClick={sendMagicLink}
                disabled={loading}
                className="mt-3 w-full rounded-lg border border-rl-border py-2.5 text-sm font-medium hover:bg-slate-50 disabled:opacity-60"
              >
                Email me a sign-in link instead
              </button>
              <p className="mt-5 text-center text-sm text-slate-600">
                {mode === "signup" ? "Already have an account?" : "New here?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === "signup" ? "signin" : "signup");
                    setError("");
                  }}
                  className="font-semibold text-rl-primary hover:underline"
                >
                  {mode === "signup" ? "Sign in" : "Create a free account"}
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
