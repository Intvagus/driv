import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Calendar, Users, FileText, Image, ArrowRight, AlertCircle } from "lucide-react";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    { count: bookingsCount },
    { count: leadsCount },
    { count: depositsPending },
    { count: newLeads },
  ] = await Promise.all([
    supabase.from("bookings").select("*", { count: "exact", head: true }),
    supabase.from("consultation_leads").select("*", { count: "exact", head: true }),
    supabase.from("bookings").select("*", { count: "exact", head: true }).eq("payment_status", "deposit_submitted"),
    supabase.from("consultation_leads").select("*", { count: "exact", head: true }).eq("status", "new"),
  ]);

  const summaryCards = [
    { label: "Total Bookings", value: bookingsCount ?? 0, icon: Calendar, href: "/admin/bookings", color: "bg-blue-50 text-blue-600" },
    { label: "Consultation Leads", value: leadsCount ?? 0, icon: Users, href: "/admin/leads", color: "bg-green-50 text-green-600" },
    { label: "Deposits to Review", value: depositsPending ?? 0, icon: AlertCircle, href: "/admin/bookings?filter=deposit_submitted", color: "bg-amber-50 text-amber-600" },
    { label: "New Leads", value: newLeads ?? 0, icon: FileText, href: "/admin/leads?filter=new", color: "bg-purple-50 text-purple-600" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-serif font-bold text-brand-dark">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome to the admin panel.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map(({ label, value, icon: Icon, href, color }) => (
          <Link
            key={label}
            href={href}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow flex items-center gap-4"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-brand-dark">{value}</div>
              <div className="text-gray-500 text-sm">{label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent bookings */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-semibold text-brand-dark">Pending Deposit Reviews</h2>
            <Link href="/admin/bookings" className="text-brand-gold text-sm flex items-center gap-1">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <RecentBookings />
        </div>

        {/* New leads */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-semibold text-brand-dark">New Consultation Leads</h2>
            <Link href="/admin/leads" className="text-brand-gold text-sm flex items-center gap-1">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <RecentLeads />
        </div>
      </div>
    </div>
  );
}

async function RecentBookings() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("bookings")
    .select("id, patient_name, patient_email, payment_status, created_at, procedures(title)")
    .eq("payment_status", "deposit_submitted")
    .order("created_at", { ascending: false })
    .limit(5);

  if (!data?.length) return <div className="p-6 text-gray-400 text-sm text-center">No pending reviews.</div>;

  return (
    <div className="divide-y divide-gray-100">
      {data.map((b) => (
        <Link key={b.id} href={`/admin/bookings/${b.id}`} className="flex items-center justify-between p-4 hover:bg-gray-50 text-sm">
          <div>
            <div className="font-medium text-brand-dark">{b.patient_name}</div>
            <div className="text-gray-500 text-xs">{(b as any).procedures?.title}</div>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400" />
        </Link>
      ))}
    </div>
  );
}

async function RecentLeads() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("consultation_leads")
    .select("id, name, email, status, created_at")
    .eq("status", "new")
    .order("created_at", { ascending: false })
    .limit(5);

  if (!data?.length) return <div className="p-6 text-gray-400 text-sm text-center">No new leads.</div>;

  return (
    <div className="divide-y divide-gray-100">
      {data.map((l) => (
        <Link key={l.id} href={`/admin/leads`} className="flex items-center justify-between p-4 hover:bg-gray-50 text-sm">
          <div>
            <div className="font-medium text-brand-dark">{l.name}</div>
            <div className="text-gray-500 text-xs">{l.email}</div>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400" />
        </Link>
      ))}
    </div>
  );
}
