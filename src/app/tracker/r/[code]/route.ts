import { NextRequest, NextResponse } from "next/server";
import { REF_COOKIE, REF_COOKIE_MAX_AGE, isValidRef } from "@/lib/tracker/referral";

// Landing link printed on clinic QR cards: remembers the clinic for 90 days
// (credited when the visitor first opens the app) and shows the home page.
export function GET(request: NextRequest, { params }: { params: { code: string } }) {
  const code = params.code.toLowerCase();
  const res = NextResponse.redirect(new URL(isValidRef(code) ? "/tracker?from=clinic" : "/tracker", request.url));
  if (isValidRef(code)) {
    res.cookies.set(REF_COOKIE, code, {
      maxAge: REF_COOKIE_MAX_AGE,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
  }
  return res;
}
