import { ADSENSE_CLIENT } from "@/lib/site";

// AdSense requires /ads.txt listing the publisher id. Empty until approved.
export const dynamic = "force-static";

export function GET() {
  const pub = ADSENSE_CLIENT.replace(/^ca-/, "");
  const body = pub ? `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n` : "";
  return new Response(body, { headers: { "Content-Type": "text/plain" } });
}
