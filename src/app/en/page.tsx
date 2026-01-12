import Link from "next/link";
import LanguageSwitch from "../components/LanguageSwitch";
import styles from "../style/page.module.css";

type BlogListResponse = {
  contents: Array<{ id: string; title: string }>;
};

type TranslationListResponse = {
  contents: Array<{ originalId: string; title: string }>;
};

export default async function HomeEn() {
  const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
  const apiKey = process.env.MICROCMS_API_KEY;
  if (!serviceDomain) throw new Error("MICROCMS_SERVICE_DOMAIN is missing");
  if (!apiKey) throw new Error("MICROCMS_API_KEY is missing");

  const [blogRes, trRes] = await Promise.all([
    fetch(`https://${serviceDomain}.microcms.io/api/v1/blog?limit=100`, {
      headers: { "X-MICROCMS-API-KEY": apiKey },
      cache: "no-store",
    }),
    fetch(
      `https://${serviceDomain}.microcms.io/api/v1/blog_translations?filters=locale[equals]en&limit=100`,
      {
        headers: { "X-MICROCMS-API-KEY": apiKey },
        cache: "no-store",
      },
    ),
  ]);

  if (!blogRes.ok) throw new Error(`microCMS(blog) error: ${blogRes.status}`);
  if (!trRes.ok) throw new Error(`microCMS(blog_translations) error: ${trRes.status}`);

  const blog = (await blogRes.json()) as BlogListResponse;
  const tr = (await trRes.json()) as TranslationListResponse;

  const titleMap = new Map(tr.contents.map((x) => [x.originalId, x.title]));

  return (
    <div className={styles.page}>
      <LanguageSwitch />
      <main>
        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/en/about">About</Link>
          <Link href="/en/contact">Contact</Link>
        </div>

        <h1>Blog</h1>
        <ul>
          {blog.contents.map((post) => (
            <li key={post.id}>
              <Link href={`/blog/${post.id}?lang=en`}>
                {titleMap.get(post.id) ?? post.title}
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}