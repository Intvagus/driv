"use client";

import { useState, useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Upload, CheckCircle, AlertCircle, Building, Smartphone } from "lucide-react";
import Link from "next/link";

export default function UploadPaymentPage({ params }: { params: { token: string } }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(f.type)) {
      setError("Only JPEG, PNG, or PDF files are allowed.");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError("File must be under 5MB.");
      return;
    }
    setError("");
    setFile(f);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("token", params.token);
      const res = await fetch("/api/upload/payment-proof", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Upload failed");
      }
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  if (done) {
    return (
      <>
        <Navbar />
        <main className="pt-20 min-h-screen bg-gray-50 flex items-center">
          <div className="container-custom max-w-lg py-20 text-center">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
            <h1 className="heading-2 text-brand-dark mb-3">Payment Proof Submitted!</h1>
            <p className="text-gray-600 mb-6">
              Our team will verify your deposit within 1–2 business hours and send you a confirmation.
            </p>
            <Button asChild variant="primary">
              <Link href="/">Back to Home</Link>
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
          <div className="container-custom max-w-xl text-center">
            <h1 className="heading-2 text-white mb-2">Upload Deposit Proof</h1>
            <p className="text-white/70">Secure your appointment by submitting your payment screenshot or receipt.</p>
          </div>
        </section>

        <section className="py-12">
          <div className="container-custom max-w-xl space-y-6">
            {/* Payment Instructions */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="font-serif font-bold text-brand-dark text-lg mb-4">Payment Options</h2>
              <div className="space-y-4">
                <div className="flex gap-3 p-4 bg-blue-50 rounded-xl">
                  <Building className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-semibold text-blue-800 text-sm">Bank Transfer</div>
                    <div className="text-blue-700 text-xs mt-1">
                      Bank: [Bank Name] (TODO: Add bank details)<br />
                      Account Title: Dr. Rana Irfan Clinic<br />
                      Account No: [XXXXXXXXXX]<br />
                      IBAN: [PK00XXXX0000000000000000]
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 p-4 bg-green-50 rounded-xl">
                  <Smartphone className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-semibold text-green-800 text-sm">JazzCash / EasyPaisa</div>
                    <div className="text-green-700 text-xs mt-1">
                      Account Name: [Name] (TODO: Add mobile wallet details)<br />
                      Number: [03XX-XXXXXXX]
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-gray-500 text-xs mt-3">
                * Please send the exact advance amount as quoted. Include your name in the transfer remarks.
              </p>
            </div>

            {/* File Upload */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="font-serif font-bold text-brand-dark text-lg mb-4">Upload Receipt</h2>

              <div
                onClick={() => inputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-brand-gold transition-colors"
              >
                <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                {file ? (
                  <div>
                    <p className="font-medium text-brand-dark">{file.name}</p>
                    <p className="text-gray-500 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-600 font-medium">Click to upload or drag & drop</p>
                    <p className="text-gray-400 text-sm mt-1">JPEG, PNG, or PDF — max 5MB</p>
                  </div>
                )}
              </div>
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />

              {error && (
                <div className="flex gap-2 mt-3 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="w-full mt-4"
                variant="primary"
                size="lg"
              >
                {uploading ? "Uploading..." : "Submit Payment Proof"}
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
