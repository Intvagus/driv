import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { BookingStatusBadge, PaymentStatusBadge } from "@/components/ui/BookingStatusBadge";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Calendar, CreditCard, ArrowRight } from "lucide-react";
import type { Database } from "@/types/database";

type Booking = Database["public"]["Tables"]["bookings"]["Row"] & {
  procedures: { title: string } | null;
};

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/login") as never;

  const { data: rawBookings } = await supabase
    .from("bookings")
    .select("*, procedures(title)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);
  const bookings = (rawBookings ?? []) as Booking[];

  const upcoming = bookings.filter(
    (b) => b.booking_status === "awaiting_deposit" || b.booking_status === "confirmed"
  );

  return (
    <div className="space-y-6">
      {/* Welcome card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-serif font-bold text-brand-dark text-xl mb-1">
          Welcome back!
        </h2>
        <p className="text-gray-500 text-sm">{user.email}</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <Calendar className="h-6 w-6 text-brand-gold mb-2" />
          <div className="text-2xl font-bold text-brand-dark">{upcoming.length}</div>
          <div className="text-gray-500 text-sm">Upcoming</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <CreditCard className="h-6 w-6 text-brand-gold mb-2" />
          <div className="text-2xl font-bold text-brand-dark">{bookings.length}</div>
          <div className="text-gray-500 text-sm">Total Bookings</div>
        </div>
      </div>

      {/* Recent bookings */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-semibold text-brand-dark">Recent Bookings</h3>
          <Button asChild variant="link" size="sm">
            <Link href="/account/appointments">View all <ArrowRight className="h-3.5 w-3.5" /></Link>
          </Button>
        </div>
        {bookings.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {bookings.map((booking) => (
              <Link
                key={booking.id}
                href={`/account/appointments/${booking.reference}`}
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div>
                  <div className="font-medium text-brand-dark text-sm">
                    {booking.procedures?.title ?? "Procedure TBD"}
                  </div>
                  <div className="text-gray-500 text-xs mt-0.5">
                    {new Date(booking.created_at).toLocaleDateString("en-PK")}
                  </div>
                </div>
                <div className="flex gap-2">
                  <BookingStatusBadge status={booking.booking_status} />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-400">
            <p className="mb-4">No bookings yet.</p>
            <Button asChild variant="primary">
              <Link href="/book">Book a Consultation</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
