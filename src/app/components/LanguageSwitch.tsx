"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

function setLangCookie(lang: "en" | "ja") {
  if (lang === "en") {
    // biome-ignore lint/suspicious/noDocumentCookie: PoCのため簡易にcookieへ保存（middlewareで参照）
    document.cookie = "lang=en; Path=/; Max-Age=31536000; SameSite=Lax";
  } else {
    // delete cookie
    // biome-ignore lint/suspicious/noDocumentCookie: PoCのため簡易にcookieを削除
    document.cookie = "lang=; Path=/; Max-Age=0; SameSite=Lax";
  }
}

export default function LanguageSwitch() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // ブログは ?lang=en 切り替え（履歴を残してOK）
  const isBlog = pathname.startsWith("/blog");

  const makeQueryHref = (nextLang: string | null) => {
    const sp = new URLSearchParams(searchParams.toString());
    if (nextLang) sp.set("lang", nextLang);
    else sp.delete("lang");
    const qs = sp.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  // 固定ページは /en を付け外し（?lang は消す）
  const makePathHref = (toEn: boolean) => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.delete("lang");

    const basePath = pathname.startsWith("/en")
      ? pathname.replace(/^\/en/, "") || "/"
      : pathname;

    const targetPath = toEn ? `/en${basePath}` : basePath;

    const qs = sp.toString();
    return qs ? `${targetPath}?${qs}` : targetPath;
  };

  const goJa = () => {
    const href = isBlog ? makeQueryHref(null) : makePathHref(false);
    if (isBlog) router.push(href);
    else {
      setLangCookie("ja");
      router.replace(href); // 固定ページは履歴を置き換える
    }
  };

  const goEn = () => {
    const href = isBlog ? makeQueryHref("en") : makePathHref(true);
    if (isBlog) router.push(href);
    else {
      setLangCookie("en");
      router.replace(href); // 固定ページは履歴を置き換える
    }
  };

  const isEnglish = isBlog
    ? searchParams.get("lang") === "en"
    : pathname.startsWith("/en");

  const toggle = () => {
    if (isEnglish) goJa();
    else goEn();
  };

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <button type="button" onClick={toggle}>
        {isEnglish ? "日本語" : "English"}
      </button>
    </div>
  );
}
