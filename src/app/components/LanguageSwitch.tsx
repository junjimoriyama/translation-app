"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function LanguageSwitch() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ブログ: ?lang=en で切り替え（翻訳が無ければDeepL→保存）
  const isBlog = pathname.startsWith("/blog");

  const makeQueryHref = (nextLang: string | null) => {
    const sp = new URLSearchParams(searchParams.toString());
    if (nextLang) sp.set("lang", nextLang);
    else sp.delete("lang");
    const qs = sp.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  // 固定ページ: /en を付け外しして切り替え（例) /about <-> /en/about）
  const makePathHref = (toEn: boolean) => {
    const sp = new URLSearchParams(searchParams.toString());
    // 固定ページでは ?lang を使わないので除去
    sp.delete("lang");

    const basePath = pathname.startsWith("/en")
      ? pathname.replace(/^\/en/, "") || "/"
      : pathname;
    const targetPath = toEn ? `/en${basePath}` : basePath;

    const qs = sp.toString();
    return qs ? `${targetPath}?${qs}` : targetPath;
  };

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <Link href={isBlog ? makeQueryHref(null) : makePathHref(false)}>
        日本語
      </Link>
      <Link href={isBlog ? makeQueryHref("en") : makePathHref(true)}>
        English
      </Link>
    </div>
  );
}
