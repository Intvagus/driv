import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { BookingStatusBadge, PaymentStatusBadge } from "@/components/ui/BookingStatusBadge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Calendar, Phone, Mail, Upload } from "lucide-react";

export default async function BookingDetailPage({
  params,
}: {
  params: { reference: string };
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: bookingRaw } = await supabase
    .from("bookings")
    .select("*, procedures(title, category)")
    .eq("reference", params.reference)
    .eq("user_id", user.id)
    .single();

  if (!bookingRaw) notFound();

  const booking = bookingRaw as typeof bookingRaw & {
    patient_name: string;
    patient_email: string;
    patient_phone: string;
    preferred_date: string | null;
    scheduled_date: string | null;
    notes: string | null;
    estimated_total: number | null;
    advance_required: number | null;
    advance_paid: number | null;
    balance_due: number | null;
    reference: string;
    created_at: string;
    booking_status: string;
    payment_status: string;
    deposit_upload_token: string;
    procedures?: { title: string; category: string } | null;
  };

  const fields = [
    { label: "Patient Name", value: booking.patient_name },
    { label: "Email", value: booking.patient_email },
    { label: "Phone", value: booking.patient_phone },
    { label: "Procedure", value: booking.procedures?.title ?? "TBD" },
    { label: "Preferred Date", value: booking.preferred_date ?? "Not specified" },
    { label: "Scheduled Date", value: booking.scheduled_date ?? "Pending confirmation" },
    { label: "Notes", value: booking.notes ?? "—" },
  ];

  const paymentFields = [
    { label: "Estimated Total", value: booking.estimated_total ? `PKR ${booking.estimated_total.toLocaleString()}` : "TBD" },
    { label: "Advance Required", value: booking.advance_required ? `PKR ${booking.advance_required.toLocaleString()}` : "TBD" },
    { label: "Advance Paid", value: booking.advance_paid ? `PKR ${booking.advance_paid.toLocaleString()}` : "—" },
    { label: "Balance Due", value: booking.balance_due ? `PKR ${booking.balance_due.toLocaleString()}` : "—" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-serif font-bold text-brand-dark text-xl mb-1">
              Booking #{String(booking.reference).slice(0, 8).toUpperCase()}
            </h2>
            <p className="text-gray-500 text-sm">
              Created {new Date(booking.created_at).toLocaleDateString("en-PK")}
            </p>
          </div>
          <div className="flex gap-2">
            <BookingStatusBadge status={booking.booking_status} />
            <PaymentStatusBadge status={booking.payment_status} />
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-brand-dark mb-4">Booking Details</h3>
        <dl className="grid sm:grid-cols-2 gap-3">
          {fields.map(({ label, value }) => (
            <div key={label}>
              <dt className="text-xs text-gray-500 uppercase tracking-wide">{label}</dt>
              <dd className="text-brand-dark font-medium text-sm mt-0.5">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Payment */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-brand-dark mb-4">Payment Summary</h3>
        <dl className="grid sm:grid-cols-2 gap-3">
          {paymentFields.map(({ label, value }) => (
            <div key={label}>
              <dt className="text-xs text-gray-500 uppercase tracking-wide">{label}</dt>
              <dd className="text-brand-dark font-medium text-sm mt-0.5">{value}</dd>
            </div>
          ))}
        </dl>
        {(booking.payment_status === "deposit_pending" || booking.payment_status === "deposit_rejected") && (
          <div className="mt-4">
            <Button asChild variant="primary">
              <Link href={`/book/${booking.deposit_upload_token}/upload`} className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload Deposit Proof
              </Link>
            </Button>
            {booking.payment_status === "deposit_rejected" && (
              <p className="text-red-600 text-xs mt-2">
                Your previous deposit proof was rejected. Please upload a new screenshot.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
