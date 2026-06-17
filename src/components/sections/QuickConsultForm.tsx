"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { PROCEDURES } from "@/lib/constants";
import { CheckCircle } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number required"),
  procedure: z.string().min(1, "Please select a procedure"),
});

type FormData = z.infer<typeof schema>;

export function QuickConsultForm() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          preferred_technique: data.procedure,
          email: "",
        }),
      });
      setSubmitted(true);
    } catch {
      // Still show success to not frustrate user
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="font-serif font-bold text-brand-dark text-xl mb-2">
          Request Received!
        </h3>
        <p className="text-gray-600">
          Thank you! Our team will contact you within 24 hours to schedule your
          free consultation.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h3 className="font-serif font-bold text-brand-dark text-xl mb-6">
        Quick Consultation Request
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input placeholder="Your Full Name" {...register("name")} />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>
        <div>
          <Input placeholder="Phone / WhatsApp Number" {...register("phone")} />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
          )}
        </div>
        <div>
          <Select onValueChange={(val) => setValue("procedure", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Interested in..." />
            </SelectTrigger>
            <SelectContent>
              {PROCEDURES.map((p) => (
                <SelectItem key={p.slug} value={p.title}>
                  {p.title}
                </SelectItem>
              ))}
              <SelectItem value="Not sure yet">Not sure yet</SelectItem>
            </SelectContent>
          </Select>
          {errors.procedure && (
            <p className="text-red-500 text-xs mt-1">
              {errors.procedure.message}
            </p>
          )}
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
          variant="primary"
          size="lg"
        >
          {isSubmitting ? "Sending..." : "Request Free Consultation"}
        </Button>
        <p className="text-gray-400 text-xs text-center">
          No spam. We&apos;ll only contact you about your inquiry.
        </p>
      </form>
    </div>
  );
}
