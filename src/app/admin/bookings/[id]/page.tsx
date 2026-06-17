import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import { BookingStatusBadge, PaymentStatusBadge } from "@/components/ui/BookingStatusBadge";
import { Button } from "@/components/ui/Button";
import { ConfirmAdvanceButton } from "./ConfirmAdvanceButton";
import { ExternalLink } from "lucide-react";

export default async function AdminBookingDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: booking } = await supabase
    .from("bookings")
    .select("*, procedures(title)")
    .eq("id", params.id)
    .single();

  if (!booking) notFound();

  // Generate signed URL for payment proof if exists
  let proofSignedUrl: string | null = null;
  if (booking.payment_status === "deposit_submitted" || booking.payment_status === "deposit_confirmed") {
    const adminClient = createAdminClient();
    const proofPath = `${booking.deposit_upload_token}`;
    const { data: signedData } = await adminClient.storage
      .from("payment-proofs")
      .createSignedUrl(proofPath, 3600);
    proofSignedUrl = signedData?.signedUrl ?? null;
  }

  const detailRows = [
    { label: "Patient Name", value: booking.patient_name },
    { label: "Email", value: booking.patient_email },
    { label: "Phone", value: booking.patient_phone },
    { label: "WhatsApp", value: booking.patient_whatsapp ?? "—" },
    { label: "Procedure", value: (booking as any).procedures?.title ?? "TBD" },
    { label: "Preferred Date", value: booking.preferred_date ?? "—" },
    { label: "Scheduled Date", value: booking.scheduled_date ?? "Not set" },
    { label: "Notes", value: booking.notes ?? "—" },
    { label: "Estimated Total", value: booking.estimated_total ? `PKR ${Number(booking.estimated_total).toLocaleString()}` : "TBD" },
    { label: "Advance Required", value: booking.advance_required ? `PKR ${Number(booking.advance_required).toLocaleString()}` : "TBD" },
    { label: "Advance Paid", value: booking.advance_paid ? `PKR ${Number(booking.advance_paid).toLocaleString()}` : "—" },
    { label: "Balance Due", value: booking.balance_due ? `PKR ${Number(booking.balance_due).toLocaleString()}` : "—" },
    { label: "Reminder Count", value: String(booking.deposit_reminder_count) },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-brand-dark">
            Booking #{String(booking.reference).slice(0, 8).toUpperCase()}
          </h1>
          <p className="text-gray-500 text-sm">
            Created {new Date(booking.created_at).toLocaleDateString("en-PK")}
          </p>
        </div>
        <div className="flex gap-2">
          <BookingStatusBadge status={booking.booking_status} />
          <PaymentStatusBadge status={booking.payment_status} />
        </div>
      </div>

      {/* Payment Proof */}
      {proofSignedUrl && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <h3 className="font-semibold text-amber-800 mb-3">Payment Proof Submitted</h3>
          <a
            href={proofSignedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-brand-gold hover:underline text-sm font-medium"
          >
            <ExternalLink className="h-4 w-4" />
            View Payment Proof
          </a>
          <div className="flex gap-3 mt-4">
            <ConfirmAdvanceButton bookingId={booking.id} action="confirm" />
            <ConfirmAdvanceButton bookingId={booking.id} action="reject" />
          </div>
        </div>
      )}

      {/* Details */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-brand-dark mb-4">Booking Details</h3>
        <dl className="grid sm:grid-cols-2 gap-4">
          {detailRows.map(({ label, value }) => (
            <div key={label}>
              <dt className="text-xs text-gray-500 uppercase tracking-wide">{label}</dt>
              <dd className="text-brand-dark font-medium text-sm mt-0.5 break-all">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Reminder */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-brand-dark mb-3">Deposit Reminder</h3>
        <p className="text-gray-500 text-sm mb-3">
          Sent {booking.deposit_reminder_count} reminder(s).
          {booking.last_deposit_reminder_sent_at && (
            <> Last sent: {new Date(booking.last_deposit_reminder_sent_at).toLocaleDateString("en-PK")}</>
          )}
        </p>
        <ConfirmAdvanceButton bookingId={booking.id} action="reminder" />
      </div>
    </div>
  );
}
