import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, Calendar, Users, Scissors, BookOpen,
  Image, Settings, LogOut, ChevronRight
} from "lucide-react";
import type { Database } from "@/types/database";

type AdminUser = Pick<
  Database["public"]["Tables"]["admin_users"]["Row"],
  "role" | "email"
>;

const adminLinks = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Bookings", href: "/admin/bookings", icon: Calendar },
  { label: "Leads", href: "/admin/leads", icon: Users },
  { label: "Procedures", href: "/admin/procedures", icon: Scissors },
  { label: "Blog", href: "/admin/blog", icon: BookOpen },
  { label: "Gallery", href: "/admin/gallery", icon: Image },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/login?redirectTo=/admin") as never;

  const { data: rawAdminUser } = await supabase
    .from("admin_users")
    .select("role, email")
    .eq("id", user.id)
    .single();
  const adminUser = rawAdminUser as AdminUser | null;

  if (!adminUser) return redirect("/");

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-dark text-white flex flex-col shrink-0">
        <div className="p-5 border-b border-white/10">
          <Link href="/" className="flex flex-col leading-none">
            <span className="text-brand-gold font-serif text-base font-bold">Dr. Rana Irfan</span>
            <span className="text-white/50 text-xs mt-0.5">Admin Panel</span>
          </Link>
        </div>
        <nav className="flex-1 py-4 space-y-0.5 px-2">
          {adminLinks.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors text-sm"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="text-white/60 text-xs mb-1">{adminUser.email}</div>
          <div className="text-brand-gold text-xs capitalize">{adminUser.role.replace("_", " ")}</div>
          <form action="/api/auth/signout" method="POST" className="mt-3">
            <button className="flex items-center gap-2 text-white/60 hover:text-white text-xs transition-colors">
              <LogOut className="h-3.5 w-3.5" /> Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
