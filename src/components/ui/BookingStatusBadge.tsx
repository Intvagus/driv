import { Badge } from "./Badge";
import { BOOKING_STATUSES, PAYMENT_STATUSES } from "@/lib/constants";

type BookingStatus = keyof typeof BOOKING_STATUSES;
type PaymentStatus = keyof typeof PAYMENT_STATUSES;

const statusVariantMap: Record<string, "success" | "warning" | "error" | "info" | "secondary"> = {
  green: "success",
  yellow: "warning",
  red: "error",
  blue: "info",
  orange: "warning",
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const config = BOOKING_STATUSES[status];
  const variant = statusVariantMap[config.color] || "secondary";
  return <Badge variant={variant}>{config.label}</Badge>;
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const config = PAYMENT_STATUSES[status];
  const variant = statusVariantMap[config.color] || "secondary";
  return <Badge variant={variant}>{config.label}</Badge>;
}
