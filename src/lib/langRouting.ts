export const FIXED_PATHS = ["/", "/about", "/contact"] as const;

export function isFixedBasePath(pathname: string): boolean {
  return (FIXED_PATHS as readonly string[]).includes(pathname);
}

/**
 * /en を含むパスを「英語かどうか」「basePath（/en を除去した固定ページ基準のパス）」に分解する。
 * - /en        -> { isEn: true,  basePath: "/" }
 * - /en/about  -> { isEn: true,  basePath: "/about" }
 * - /about     -> { isEn: false, basePath: "/about" }
 */
export function splitEnPath(pathname: string): {
  isEn: boolean;
  basePath: string;
} {
  const isEn = pathname === "/en" || pathname.startsWith("/en/");
  if (!isEn) return { isEn: false, basePath: pathname };
  if (pathname === "/en") return { isEn: true, basePath: "/" };
  return { isEn: true, basePath: pathname.replace(/^\/en/, "") };
}

export function toEnPath(basePath: string): string {
  return basePath === "/" ? "/en" : `/en${basePath}`;
}

/**
 * 固定ページ（/, /about, /contact）を、wantsEn に合わせて正規化する。
 * - 正規化が不要なら null を返す
 * - 正規化が必要なら遷移先 pathname を返す（queryは扱わない）
 */
export function normalizeFixedPath(
  pathname: string,
  wantsEn: boolean,
): string | null {
  const { isEn, basePath } = splitEnPath(pathname);
  if (!isFixedBasePath(basePath)) return null;

  if (wantsEn) {
    if (isEn) return null;
    return toEnPath(basePath);
  }

  // wants Japanese
  if (!isEn) return null;
  return basePath;
}
