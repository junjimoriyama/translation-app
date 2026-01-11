import LanguageSwitch from "@/app/components/LanguageSwitch";

type BlogContent = {
  id: string;
  title: string;
  body: string;
};

async function deeplTranslate(text: string, isHtml: boolean) {
  const deeplKey = process.env.DEEPL_API_KEY;
  if (!deeplKey) throw new Error("DEEPL_API_KEY is missing");

  const params = new URLSearchParams({
    auth_key: deeplKey,
    text,
    target_lang: "EN",
  });
  if (isHtml) params.set("tag_handling", "html");

  const res = await fetch("https://api-free.deepl.com/v2/translate", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
    cache: "no-store",
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`DeepL error: ${res.status} ${t}`);
  }

  const data = (await res.json()) as { translations: Array<{ text: string }> };
  return data.translations[0]?.text ?? "";
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ lang?: string }>;
}) {
  const { id } = await params;
  const { lang } = (await searchParams) ?? {};
  const isEn = lang === "en";

  const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
  const apiKey = process.env.MICROCMS_API_KEY;
  if (!serviceDomain) throw new Error("MICROCMS_SERVICE_DOMAIN is missing");
  if (!apiKey) throw new Error("MICROCMS_API_KEY is missing");

  // 日本語（元記事）
  const resJa = await fetch(
    `https://${serviceDomain}.microcms.io/api/v1/blog/${id}`,
    { headers: { "X-MICROCMS-API-KEY": apiKey }, cache: "no-store" },
  );
  if (!resJa.ok) throw new Error(`microCMS(blog) error: ${resJa.status}`);
  const ja = (await resJa.json()) as BlogContent;

  // 表示する内容（デフォルトは日本語）
  let content = ja;

  // 英語の場合は、保存済み翻訳があれば差し替える
  if (isEn) {
    const url = new URL(
      `https://${serviceDomain}.microcms.io/api/v1/blog_translations`,
    );
    url.searchParams.set("limit", "1");
    url.searchParams.set(
      "filters",
      `originalId[equals]${id}[and]locale[equals]en`,
    );

    const resTr = await fetch(url, {
      headers: { "X-MICROCMS-API-KEY": apiKey },
      cache: "no-store",
    });

    if (resTr.ok) {
      const tr = (await resTr.json()) as {
        contents: Array<{ title: string; body: string }>;
      };
      if (tr.contents[0]) {
        content = {
          ...ja,
          title: tr.contents[0].title,
          body: tr.contents[0].body,
        };
      }
    }

    // 翻訳が無ければ DeepL で生成して保存 → 表示
    if (content === ja) {
      const titleEn = await deeplTranslate(ja.title, false);
      const bodyEn = await deeplTranslate(ja.body, true);

      const resCreate = await fetch(
        `https://${serviceDomain}.microcms.io/api/v1/blog_translations`,
        {
          method: "POST",
          headers: {
            "X-MICROCMS-API-KEY": apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            originalId: id,
            locale: "en",
            title: titleEn,
            body: bodyEn,
          }),
        },
      );

      // 保存に失敗しても表示は英語にする（PoC向け）
      content = { ...ja, title: titleEn, body: bodyEn };
      if (!resCreate.ok) {
        // eslint-disable-next-line no-console
        console.warn(
          "microCMS(blog_translations) create failed:",
          resCreate.status,
        );
      }
    }
  }

  const decodeEntities = (s: string) =>
    s.replaceAll("&#x27;", "'").replaceAll("&quot;", '"');

  return (
    <main className="eachBlog">
     <LanguageSwitch />

      <h1>{decodeEntities(content.title)}</h1>
<div>{decodeEntities(content.body)}</div>
    </main>
  );
}
