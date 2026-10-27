import { TreatmentsManager } from "@/components/tracker/TreatmentsManager";
import { requireTrackerUser } from "@/lib/tracker/server";

export default async function TreatmentsPage() {
  const { user } = await requireTrackerUser();
  return <TreatmentsManager userId={user.id} />;
}
