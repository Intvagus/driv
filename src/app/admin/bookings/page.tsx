import { createClient } from "@/lib/supabase/server";
import { BookingStatusBadge, PaymentStatusBadge } from "@/components/ui/BookingStatusBadge";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: { filter?: string };
}) {
  const supabase = await createClient();
  let query = supabase
    .from("bookings")
    .select("*, procedures(title)")
    .order("created_at", { ascending: false });

  if (searchParams.filter) {
    query = query.eq("payment_status", searchParams.filter) as typeof query;
  }

  const { data: bookings } = await query;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif font-bold text-brand-dark">Bookings</h1>
        <div className="flex gap-2 text-sm">
          {[
            ["All", ""],
            ["Deposit Submitted", "deposit_submitted"],
            ["Confirmed", "confirmed"],
            ["Completed", "completed"],
          ].map(([label, filter]) => (
            <Link
              key={filter}
              href={filter ? `/admin/bookings?filter=${filter}` : "/admin/bookings"}
              className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${
                (searchParams.filter ?? "") === filter
                  ? "bg-brand-dark text-white border-brand-dark"
                  : "bg-white text-gray-600 border-gray-200 hover:border-brand-gold"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {["Reference", "Patient", "Procedure", "Date", "Booking Status", "Payment Status", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings?.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">
                    #{String(b.reference).slice(0, 8).toUpperCase()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-brand-dark">{b.patient_name}</div>
                    <div className="text-gray-500 text-xs">{b.patient_email}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {(b as any).procedures?.title ?? "TBD"}
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {b.preferred_date ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <BookingStatusBadge status={b.booking_status} />
                  </td>
                  <td className="px-4 py-3">
                    <PaymentStatusBadge status={b.payment_status} />
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/bookings/${b.id}`} className="text-brand-gold hover:text-brand-gold-dark">
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
              {!bookings?.length && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
