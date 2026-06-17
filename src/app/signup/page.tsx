"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error: err } = await supabase.auth.signUp({
      email,
      password: Math.random().toString(36), // Passwordless - use magic link
      options: {
        emailRedirectTo: `${window.location.origin}/account`,
      },
    });
    if (err) setError(err.message);
    else setSent(true);
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-gray-50 flex items-center">
        <div className="container-custom max-w-md py-12">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            {sent ? (
              <div className="text-center">
                <CheckCircle className="h-14 w-14 text-green-500 mx-auto mb-4" />
                <h1 className="font-serif font-bold text-brand-dark text-2xl mb-2">Check Your Email</h1>
                <p className="text-gray-600">
                  We&apos;ve sent a confirmation link to <strong>{email}</strong>. Click the link to activate your account.
                </p>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h1 className="font-serif font-bold text-brand-dark text-2xl mb-1">Create Account</h1>
                  <p className="text-gray-500 text-sm">Track your bookings and consultations.</p>
                </div>
                <form onSubmit={handleSignup} className="space-y-4">
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <Button type="submit" className="w-full" variant="primary" size="lg" disabled={loading}>
                    {loading ? "Creating..." : "Create Account"}
                  </Button>
                </form>
                <p className="text-center text-gray-400 text-sm mt-4">
                  Already have an account?{" "}
                  <Link href="/login" className="text-brand-gold hover:underline">Sign in</Link>
                </p>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
