"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { normalizeFixedPath } from "../../lib/langRouting";

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
      const target = normalizeFixedPath(pathname, wantsEn);
      if (!target) return;
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
