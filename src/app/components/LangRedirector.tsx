"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const FIXED_PATHS = new Set<string>(["/", "/about", "/contact"]);

function getCookie(name: string): string | undefined {
  const parts = document.cookie.split(";").map((s) => s.trim());
  for (const part of parts) {
    if (!part) continue;
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    const k = part.slice(0, eq);
    if (k !== name) continue;
    return decodeURIComponent(part.slice(eq + 1));
  }
  return undefined;
}

export default function LangRedirector() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const apply = () => {
      const lang = getCookie("lang");
      const wantsEn = lang === "en";

      // Only affect fixed pages (blog is handled by ?lang=...)
      const isEnPath = pathname === "/en" || pathname.startsWith("/en/");
      const basePath = isEnPath
        ? pathname === "/en"
          ? "/"
          : pathname.replace(/^\/en/, "")
        : pathname;

      if (!FIXED_PATHS.has(basePath)) return;

      // If user wants Japanese, normalize /en fixed routes back to Japanese.
      if (!wantsEn) {
        if (isEnPath) router.replace(basePath);
        return;
      }

      // If user wants English, normalize Japanese fixed routes to /en.
      if (isEnPath) return;
      const target = basePath === "/" ? "/en" : `/en${basePath}`;
      router.replace(target);
    };

    // Normal client navigations
    apply();
    // BFCache restore via back/forward
    window.addEventListener("pageshow", apply);
    return () => window.removeEventListener("pageshow", apply);
  }, [pathname, router]);

  return null;
}
