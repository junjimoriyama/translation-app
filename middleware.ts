import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { normalizeFixedPath } from "./src/lib/langRouting";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const lang = req.cookies.get("lang")?.value;
  const wantsEn = lang === "en";
  const target = normalizeFixedPath(pathname, wantsEn);
  if (!target) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = target;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/", "/about", "/contact", "/en", "/en/about", "/en/contact"],
};
