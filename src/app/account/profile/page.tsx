"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CheckCircle, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="space-y-6 max-w-lg">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-serif font-bold text-brand-dark text-xl mb-4">Profile</h2>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide block mb-1">Email</label>
            <Input value={user?.email ?? ""} disabled className="bg-gray-50" />
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide block mb-1">Member Since</label>
            <Input
              value={user?.created_at ? new Date(user.created_at).toLocaleDateString("en-PK") : ""}
              disabled
              className="bg-gray-50"
            />
          </div>
        </div>
        {saved && (
          <div className="flex items-center gap-2 text-green-600 text-sm mt-3">
            <CheckCircle className="h-4 w-4" /> Saved successfully
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-brand-dark mb-3">Account Actions</h3>
        <Button
          variant="destructive"
          onClick={handleSignOut}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
