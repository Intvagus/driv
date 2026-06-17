"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Bell } from "lucide-react";

interface Props {
  bookingId: string;
  action: "confirm" | "reject" | "reminder";
}

export function ConfirmAdvanceButton({ bookingId, action }: Props) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    setLoading(true);
    try {
      const endpoint =
        action === "confirm"
          ? `/api/bookings/${bookingId}/confirm-advance`
          : action === "reject"
          ? `/api/bookings/${bookingId}/reject-advance`
          : `/api/bookings/${bookingId}/send-reminder`;

      await fetch(endpoint, { method: "POST" });
      setDone(true);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const config = {
    confirm: { label: "Confirm Advance", icon: CheckCircle, variant: "primary" as const },
    reject: { label: "Reject Advance", icon: XCircle, variant: "destructive" as const },
    reminder: { label: "Send Reminder", icon: Bell, variant: "secondary" as const },
  }[action];

  const Icon = config.icon;

  return (
    <Button
      onClick={handleClick}
      disabled={loading || done}
      variant={config.variant}
      size="sm"
      className="flex items-center gap-2"
    >
      <Icon className="h-4 w-4" />
      {loading ? "Processing..." : done ? "Done!" : config.label}
    </Button>
  );
}
