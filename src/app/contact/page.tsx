"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFAB } from "@/components/layout/WhatsAppFAB";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { CLINIC_ADDRESS, CLINIC_PHONE, CLINIC_EMAIL, WHATSAPP_NUMBER } from "@/lib/constants";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  message: z.string().min(10, "Please provide more detail"),
});

type FormData = z.infer<typeof schema>;

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    // In production, send to an API route or email service
    await new Promise((r) => setTimeout(r, 1000));
    setSent(true);
  };

  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="bg-gradient-to-br from-brand-dark to-brand-dark-light py-20">
          <div className="container-custom text-center">
            <h1 className="heading-1 text-white mb-4">Contact Us</h1>
            <p className="text-white/70 text-lg max-w-xl mx-auto">
              We&apos;re here to answer your questions and schedule your free consultation.
            </p>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-custom grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="heading-3 text-brand-dark mb-6">Get In Touch</h2>
              <div className="space-y-4 mb-8">
                {[
                  { icon: MapPin, label: "Address", value: CLINIC_ADDRESS },
                  { icon: Phone, label: "Phone", value: CLINIC_PHONE, href: `tel:${CLINIC_PHONE}` },
                  { icon: Mail, label: "Email", value: CLINIC_EMAIL, href: `mailto:${CLINIC_EMAIL}` },
                ].map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-brand-gold/20 flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-brand-gold" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">{label}</div>
                      {href ? (
                        <a href={href} className="text-brand-dark hover:text-brand-gold transition-colors font-medium">
                          {value}
                        </a>
                      ) : (
                        <div className="text-brand-dark font-medium">{value}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <a
                href={`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                Chat on WhatsApp
              </a>

              {/* Map placeholder */}
              <div className="mt-8 aspect-video bg-gray-200 rounded-xl flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <MapPin className="h-12 w-12 mx-auto mb-2" />
                  <p className="text-sm">Google Maps will be embedded here</p>
                  <p className="text-xs">(Configure in admin settings)</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="heading-3 text-brand-dark mb-6">Send a Message</h2>
              {sent ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                  <div className="text-4xl mb-3">✓</div>
                  <h3 className="font-bold text-green-800 text-lg mb-1">Message Sent!</h3>
                  <p className="text-green-700 text-sm">We&apos;ll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <Input placeholder="Full Name" {...register("name")} />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <Input type="email" placeholder="Email Address" {...register("email")} />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <Input placeholder="Phone Number" {...register("phone")} />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                  </div>
                  <div>
                    <Textarea placeholder="Your message..." rows={5} {...register("message")} />
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                  </div>
                  <Button type="submit" className="w-full" variant="primary" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
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
