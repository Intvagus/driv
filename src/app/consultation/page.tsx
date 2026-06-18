"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFAB } from "@/components/layout/WhatsAppFAB";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { NORWOOD_STAGES, PROCEDURES } from "@/lib/constants";
import { CheckCircle, Upload, ChevronRight } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Valid phone required"),
  age: z.string().optional(),
  norwood_stage: z.string().optional(),
  hair_loss_area: z.string().optional(),
  preferred_technique: z.string().optional(),
  budget: z.string().optional(),
  medical_history: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function ConsultationPage() {
  const [step, setStep] = useState(0);
  const [photo, setPhoto] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const photoRef = useRef<HTMLInputElement>(null);
  const { register, handleSubmit, setValue, formState: { errors: rawErrors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const errors = rawErrors as any;

  const onSubmit = async (data: FormData) => {
    try {
      const body = new FormData();
      Object.entries(data).forEach(([k, v]) => v && body.append(k, v));
      if (photo) body.append("photo", photo);
      await fetch("/api/consultation", { method: "POST", body });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <>
        <Navbar />
        <main className="pt-20 min-h-screen bg-gray-50 flex items-center">
          <div className="container-custom max-w-lg py-20 text-center">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
            <h1 className="heading-2 text-brand-dark mb-3">Assessment Submitted!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for submitting your hair loss assessment. Dr. Rana Irfan&apos;s
              team will review your information and contact you within 24 hours with
              personalized recommendations.
            </p>
            <Button asChild variant="primary">
              <a href="/">Back to Home</a>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-gray-50">
        <section className="bg-gradient-to-br from-brand-dark to-brand-dark-light py-16">
          <div className="container-custom text-center max-w-2xl">
            <span className="text-brand-gold text-sm font-semibold uppercase tracking-widest">
              100% Free, No Obligation
            </span>
            <h1 className="heading-2 text-white mt-2 mb-3">Online Hair Loss Assessment</h1>
            <p className="text-white/70">
              Share your hair loss details and receive a personalized treatment
              recommendation from Dr. Rana Irfan within 24 hours.
            </p>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-custom max-w-xl">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-5">
              <h2 className="font-serif font-bold text-brand-dark text-xl">Your Information</h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Input placeholder="Full Name *" {...register("name")} />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name?.message as string ?? ""}</p>}
                </div>
                <div>
                  <Input placeholder="Age" type="number" {...register("age")} />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Input type="email" placeholder="Email Address *" {...register("email")} />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email?.message as string ?? ""}</p>}
                </div>
                <div>
                  <Input placeholder="Phone / WhatsApp *" {...register("phone")} />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone?.message as string ?? ""}</p>}
                </div>
              </div>

              <h3 className="font-semibold text-brand-dark pt-2">Hair Loss Details</h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <Select onValueChange={(v: string) => setValue("norwood_stage", v)}>
                  <SelectTrigger><SelectValue placeholder="Norwood Stage (if known)" /></SelectTrigger>
                  <SelectContent>
                    {NORWOOD_STAGES.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                    <SelectItem value="Not sure">Not sure</SelectItem>
                  </SelectContent>
                </Select>
                <Select onValueChange={(v: string) => setValue("preferred_technique", v)}>
                  <SelectTrigger><SelectValue placeholder="Preferred Procedure" /></SelectTrigger>
                  <SelectContent>
                    {PROCEDURES.map((p) => (
                      <SelectItem key={p.slug} value={p.title}>{p.title}</SelectItem>
                    ))}
                    <SelectItem value="Not sure">Not sure – need recommendation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Input placeholder="Affected areas (e.g. crown, temples, entire scalp)" {...register("hair_loss_area")} />
              </div>

              <Select onValueChange={(v: string) => setValue("budget", v)}>
                <SelectTrigger><SelectValue placeholder="Approximate Budget (PKR)" /></SelectTrigger>
                <SelectContent>
                  {["Under 100,000", "100,000 – 200,000", "200,000 – 350,000", "350,000+", "Flexible"].map((b) => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Textarea placeholder="Any relevant medical history (medications, scalp conditions, previous transplants...)" rows={3} {...register("medical_history")} />

              <Textarea placeholder="Additional notes or questions..." rows={3} {...register("notes")} />

              {/* Photo upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Hair Loss Photo (Optional)
                </label>
                <div
                  onClick={() => photoRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-5 text-center cursor-pointer hover:border-brand-gold transition-colors"
                >
                  <Upload className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                  <p className="text-gray-500 text-sm">
                    {photo ? photo.name : "Click to upload a photo of your scalp (JPEG/PNG, max 5MB)"}
                  </p>
                </div>
                <input
                  ref={photoRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </div>

              <Button type="submit" className="w-full" variant="primary" size="lg" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Free Assessment"}
              </Button>

              <p className="text-gray-400 text-xs text-center">
                Your information is kept strictly confidential and will only be used to prepare your personalized treatment recommendation.
              </p>
            </form>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFAB />
    </>
  );
}
