import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PaymentStatusBadge } from "@/components/ui/BookingStatusBadge";
import type { Database } from "@/types/database";

type PaymentBooking = Pick<
  Database["public"]["Tables"]["bookings"]["Row"],
  "reference" | "payment_status" | "estimated_total" | "advance_paid" | "balance_due" | "created_at"
> & {
  procedures: { title: string } | null;
};

export default async function PaymentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: rawBookings } = await supabase
    .from("bookings")
    .select("reference, procedures(title), payment_status, estimated_total, advance_paid, balance_due, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  const bookings = (rawBookings ?? []) as PaymentBooking[];

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="p-5 border-b border-gray-100">
        <h2 className="font-semibold text-brand-dark">Payment History</h2>
      </div>
      {bookings.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {["Reference", "Procedure", "Total", "Advance Paid", "Balance Due", "Status"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.map((b) => (
                <tr key={b.reference} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-brand-dark">
                    #{String(b.reference).slice(0, 8).toUpperCase()}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {b.procedures?.title ?? "TBD"}
                  </td>
                  <td className="px-4 py-3">
                    {b.estimated_total ? `PKR ${Number(b.estimated_total).toLocaleString()}` : "TBD"}
                  </td>
                  <td className="px-4 py-3">
                    {b.advance_paid ? `PKR ${Number(b.advance_paid).toLocaleString()}` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {b.balance_due ? `PKR ${Number(b.balance_due).toLocaleString()}` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <PaymentStatusBadge status={b.payment_status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-12 text-center text-gray-400">No payment records found.</div>
      )}
    </div>
  );
}
