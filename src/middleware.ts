import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SITE_URL } from "@/lib/constants";

// Rootline on its own domain (NEXT_PUBLIC_TRACKER_URL): clean paths there
// are served from /tracker/*, and /tracker/* on the clinic domain redirects
// over. Preview and local hosts match neither and are left alone.
// Read directly rather than imported from @/lib/tracker/urls: that import
// made the build warn about supabase-js using Node APIs in the Edge Runtime.
const TRACKER_ORIGIN = process.env.NEXT_PUBLIC_TRACKER_URL?.replace(/\/$/, "") || "";
const bareHost = (host: string) => host.toLowerCase().replace(/^www\./, "");
const TRACKER_HOST = TRACKER_ORIGIN ? bareHost(new URL(TRACKER_ORIGIN).host) : null;
const CLINIC_HOST = bareHost(new URL(SITE_URL).host);
// Served as-is on the tracker domain: internal links, its API, sign-in,
// and /.well-known (Play Store asset links).
const TRACKER_PASSTHROUGH = /^\/(tracker|api\/tracker|auth\/callback|_next|\.well-known)(\/|$)/;

function trackerDomainRoute(request: NextRequest): { redirect?: URL; rewrite?: URL } | null {
  if (!TRACKER_HOST) return null;
  const host = bareHost(request.headers.get("host") ?? request.nextUrl.host);
  const { pathname, search } = request.nextUrl;

  if (host === TRACKER_HOST) {
    if (TRACKER_PASSTHROUGH.test(pathname)) return null;
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/" ? "/tracker" : `/tracker${pathname}`;
    return { rewrite: url };
  }
  if (host === CLINIC_HOST && (pathname === "/tracker" || pathname.startsWith("/tracker/"))) {
    return { redirect: new URL(`${pathname.slice("/tracker".length) || "/"}${search}`, TRACKER_ORIGIN) };
  }
  return null;
}

export async function middleware(request: NextRequest) {
  const domainRoute = trackerDomainRoute(request);
  if (domainRoute?.redirect) return NextResponse.redirect(domainRoute.redirect, 308);
  const rewriteTo = domainRoute?.rewrite;
  // The response that serves the page: the same path, or its /tracker twin.
  const pass = () => (rewriteTo ? NextResponse.rewrite(rewriteTo, { request }) : NextResponse.next({ request }));

  let supabaseResponse = pass();

  // If Supabase isn't configured (missing env vars) or the auth check fails
  // for any other reason, treat the visitor as logged out rather than
  // crashing the whole site with a 500 — /account and /admin still redirect
  // to /login below, everything else still renders normally.
  let user: { id: string } | null = null;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            supabaseResponse = pass();
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      });

      const { data } = await supabase.auth.getUser();
      user = data.user;
    } catch (err) {
      console.error("Supabase auth check failed in middleware:", err);
    }
  }

  // Protection rules look at the page actually served.
  const pathname = rewriteTo?.pathname ?? request.nextUrl.pathname;

  // Protect /account routes - must be logged in
  if (pathname.startsWith("/account")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Protect /admin routes - must be logged in (role check done in layout)
  if (pathname.startsWith("/admin")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Protect the Rootline tracker app - it has its own sign-in page
  if (pathname.startsWith("/tracker/app")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/tracker/login";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    // /epi is a self-contained tool with no login/account system — it must
    // not depend on Supabase being configured, so it's excluded here. The
    // tracker's PWA files are public and fetched in the background.
    "/((?!_next/static|_next/image|favicon.ico|epi(?:/|$)|api/epi(?:/|$)|tracker/sw\\.js|tracker/manifest\\.webmanifest|tracker/offline|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
