import { NextResponse } from "next/server";

// Digital Asset Links for the Rootline Android app (a Trusted Web Activity
// wrapping /tracker, e.g. built with PWABuilder). Lets the Play Store app
// open the site full-screen without a browser bar. 404 until configured.
export const dynamic = "force-dynamic";

export function GET() {
  const packageName = process.env.ANDROID_PACKAGE_NAME;
  const fingerprints = process.env.ANDROID_SHA256_CERT_FINGERPRINTS?.split(",").map((f) => f.trim()).filter(Boolean);
  if (!packageName || !fingerprints?.length) {
    return new NextResponse("Not found", { status: 404 });
  }
  return NextResponse.json([
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: { namespace: "android_app", package_name: packageName, sha256_cert_fingerprints: fingerprints },
    },
  ]);
}
