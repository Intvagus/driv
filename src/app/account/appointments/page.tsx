import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { BookingStatusBadge, PaymentStatusBadge } from "@/components/ui/BookingStatusBadge";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function AppointmentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: bookings } = await supabase
    .from("bookings")
    .select("*, procedures(title)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="p-5 border-b border-gray-100">
        <h2 className="font-semibold text-brand-dark">All Appointments</h2>
      </div>
      {bookings && bookings.length > 0 ? (
        <div className="divide-y divide-gray-100">
          {bookings.map((booking) => (
            <Link
              key={booking.id}
              href={`/account/appointments/${booking.reference}`}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-gray-50 transition-colors gap-2"
            >
              <div>
                <div className="font-medium text-brand-dark">
                  {(booking as any).procedures?.title ?? "Procedure TBD"}
                </div>
                <div className="text-gray-500 text-xs mt-0.5">
                  Ref: {String(booking.reference).slice(0, 8).toUpperCase()} · Booked{" "}
                  {new Date(booking.created_at).toLocaleDateString("en-PK")}
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <BookingStatusBadge status={booking.booking_status} />
                <PaymentStatusBadge status={booking.payment_status} />
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center text-gray-400">
          <p>No appointments found.</p>
        </div>
      )}
    </div>
  );
}
