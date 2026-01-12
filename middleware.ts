import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const FIXED_PATHS = new Set<string>(["/", "/about", "/contact"]);

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only handle fixed pages (and their /en variants)
  const isEnPath = pathname === "/en" || pathname.startsWith("/en/");
  const basePath = isEnPath
    ? pathname === "/en"
      ? "/"
      : pathname.replace(/^\/en/, "")
    : pathname;

  if (!FIXED_PATHS.has(basePath)) return NextResponse.next();

  const lang = req.cookies.get("lang")?.value;
  const wantsEn = lang === "en";

  // If user wants Japanese, redirect /en fixed routes back to Japanese routes.
  if (!wantsEn && isEnPath) {
    const url = req.nextUrl.clone();
    url.pathname = basePath;
    return NextResponse.redirect(url);
  }

  // If user wants English, redirect Japanese fixed routes to /en routes.
  if (!wantsEn) return NextResponse.next();

  // Cookie says English: redirect Japanese fixed routes to /en
  if (isEnPath) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = basePath === "/" ? "/en" : `/en${basePath}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/", "/about", "/contact", "/en", "/en/about", "/en/contact"],
};
