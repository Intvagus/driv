"use client";

import { useState } from "react";
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
import { PROCEDURES } from "@/lib/constants";
import { CheckCircle, ChevronRight } from "lucide-react";
import Link from "next/link";

const step1Schema = z.object({
  procedure: z.string().min(1, "Please select a procedure"),
});

const step2Schema = z.object({
  patient_name: z.string().min(2, "Full name required"),
  patient_email: z.string().email("Valid email required"),
  patient_phone: z.string().min(10, "Valid phone required"),
  patient_whatsapp: z.string().optional(),
});

const step3Schema = z.object({
  preferred_date: z.string().min(1, "Please select a date"),
  notes: z.string().optional(),
});

type BookingData = {
  procedure: string;
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  patient_whatsapp: string;
  preferred_date: string;
  notes: string;
};

const steps = ["Procedure", "Your Details", "Preferred Date", "Review"];

export default function BookPage() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Partial<BookingData>>({});
  const [submitted, setSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState("");
  const [uploadToken, setUploadToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const step1 = useForm({ resolver: zodResolver(step1Schema) });
  const step2 = useForm({ resolver: zodResolver(step2Schema) });
  const step3 = useForm({ resolver: zodResolver(step3Schema) });

  const handleStep1 = step1.handleSubmit((data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(1);
  });

  const handleStep2 = step2.handleSubmit((data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(2);
  });

  const handleStep3 = step3.handleSubmit((data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(3);
  });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (res.ok) {
        setBookingRef(json.reference);
        setUploadToken(json.deposit_upload_token);
        setSubmitted(true);
      }
    } catch {
      // handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <>
        <Navbar />
        <main className="pt-20 min-h-screen bg-gray-50">
          <div className="container-custom max-w-xl py-20 text-center">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
            <h1 className="heading-2 text-brand-dark mb-3">Booking Confirmed!</h1>
            <p className="text-gray-600 mb-2">
              Your booking reference is: <strong className="text-brand-dark">{bookingRef}</strong>
            </p>
            <p className="text-gray-600 mb-6">
              To secure your appointment, please upload your deposit payment proof using the link below.
            </p>
            <Button asChild variant="primary" size="lg">
              <Link href={`/book/${uploadToken}/upload`}>
                Upload Deposit Proof
              </Link>
            </Button>
            <p className="text-gray-400 text-xs mt-4">
              You can also access this link from the confirmation email we&apos;ll send you.
            </p>
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
          <div className="container-custom text-center">
            <h1 className="heading-2 text-white mb-2">Book Your Consultation</h1>
            <p className="text-white/70">Complete the form below to book your appointment.</p>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-custom max-w-xl">
            {/* Progress */}
            <div className="flex items-center justify-between mb-10">
              {steps.map((s, i) => (
                <div key={s} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                        i < step
                          ? "bg-green-500 text-white"
                          : i === step
                          ? "bg-brand-gold text-brand-dark"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      {i < step ? "✓" : i + 1}
                    </div>
                    <span className="text-xs mt-1 text-gray-500 hidden sm:block">{s}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`h-px w-12 sm:w-16 mx-2 ${i < step ? "bg-green-400" : "bg-gray-200"}`} />
                  )}
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              {/* Step 1: Procedure */}
              {step === 0 && (
                <form onSubmit={handleStep1} className="space-y-5">
                  <h2 className="font-serif font-bold text-brand-dark text-xl">Select Procedure</h2>
                  <div>
                    <Select onValueChange={(v: string) => step1.setValue("procedure", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a procedure..." />
                      </SelectTrigger>
                      <SelectContent>
                        {PROCEDURES.map((p) => (
                          <SelectItem key={p.slug} value={p.title}>{p.title}</SelectItem>
                        ))}
                        <SelectItem value="Not sure - need advice">Not sure – need advice</SelectItem>
                      </SelectContent>
                    </Select>
                    {step1.formState.errors.procedure && (
                      <p className="text-red-500 text-xs mt-1">{step1.formState.errors.procedure?.message as string ?? ""}</p>
                    )}
                  </div>
                  <Button type="submit" className="w-full" variant="primary" size="lg">
                    Next <ChevronRight className="h-4 w-4" />
                  </Button>
                </form>
              )}

              {/* Step 2: Contact Details */}
              {step === 1 && (
                <form onSubmit={handleStep2} className="space-y-4">
                  <h2 className="font-serif font-bold text-brand-dark text-xl">Your Details</h2>
                  <div>
                    <Input placeholder="Full Name" {...step2.register("patient_name")} />
                    {step2.formState.errors.patient_name && <p className="text-red-500 text-xs mt-1">{step2.formState.errors.patient_name?.message as string ?? ""}</p>}
                  </div>
                  <div>
                    <Input type="email" placeholder="Email Address" {...step2.register("patient_email")} />
                    {step2.formState.errors.patient_email && <p className="text-red-500 text-xs mt-1">{step2.formState.errors.patient_email?.message as string ?? ""}</p>}
                  </div>
                  <div>
                    <Input placeholder="Phone Number" {...step2.register("patient_phone")} />
                    {step2.formState.errors.patient_phone && <p className="text-red-500 text-xs mt-1">{step2.formState.errors.patient_phone?.message as string ?? ""}</p>}
                  </div>
                  <div>
                    <Input placeholder="WhatsApp Number (if different)" {...step2.register("patient_whatsapp")} />
                  </div>
                  <div className="flex gap-3">
                    <Button type="button" variant="ghost" onClick={() => setStep(0)} className="flex-1">Back</Button>
                    <Button type="submit" variant="primary" className="flex-1" size="lg">Next <ChevronRight className="h-4 w-4" /></Button>
                  </div>
                </form>
              )}

              {/* Step 3: Date + Notes */}
              {step === 2 && (
                <form onSubmit={handleStep3} className="space-y-4">
                  <h2 className="font-serif font-bold text-brand-dark text-xl">Preferred Date</h2>
                  <div>
                    <Input
                      type="date"
                      min={new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0]}
                      {...step3.register("preferred_date")}
                    />
                    {step3.formState.errors.preferred_date && <p className="text-red-500 text-xs mt-1">{step3.formState.errors.preferred_date?.message as string ?? ""}</p>}
                  </div>
                  <div>
                    <Textarea placeholder="Any additional notes, questions, or medical information..." rows={4} {...step3.register("notes")} />
                  </div>
                  <div className="flex gap-3">
                    <Button type="button" variant="ghost" onClick={() => setStep(1)} className="flex-1">Back</Button>
                    <Button type="submit" variant="primary" className="flex-1" size="lg">Review <ChevronRight className="h-4 w-4" /></Button>
                  </div>
                </form>
              )}

              {/* Step 4: Review */}
              {step === 3 && (
                <div className="space-y-5">
                  <h2 className="font-serif font-bold text-brand-dark text-xl">Review & Confirm</h2>
                  <div className="space-y-3 bg-gray-50 rounded-xl p-5">
                    {[
                      { label: "Procedure", value: formData.procedure },
                      { label: "Name", value: formData.patient_name },
                      { label: "Email", value: formData.patient_email },
                      { label: "Phone", value: formData.patient_phone },
                      { label: "Preferred Date", value: formData.preferred_date },
                      { label: "Notes", value: formData.notes || "—" },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between text-sm">
                        <span className="text-gray-500">{label}</span>
                        <span className="font-medium text-brand-dark">{value}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    By confirming, you agree to our Terms of Service. A deposit will be required to fully confirm your appointment.
                  </p>
                  <div className="flex gap-3">
                    <Button type="button" variant="ghost" onClick={() => setStep(2)} className="flex-1">Back</Button>
                    <Button onClick={handleSubmit} variant="primary" className="flex-1" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? "Confirming..." : "Confirm Booking"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFAB />
    </>
  );
}
