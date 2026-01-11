import Link from "next/link";
import LanguageSwitch from "../components/LanguageSwitch";

type BlogListResponse = {
  contents: Array<{ id: string; title: string }>;
};

export default async function Blogs() {
  const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
  const apiKey = process.env.MICROCMS_API_KEY;
  if (!serviceDomain) throw new Error("MICROCMS_SERVICE_DOMAIN is missing");
  if (!apiKey) throw new Error("MICROCMS_API_KEY is missing");

  const res = await fetch(
    `https://${serviceDomain}.microcms.io/api/v1/blog?limit=20`,
    { headers: { "X-MICROCMS-API-KEY": apiKey }, cache: "no-store" },
  );
  if (!res.ok) throw new Error(`microCMS error: ${res.status}`);

  const data = (await res.json()) as BlogListResponse;

  return (
    <main>
      <h1>ブログ</h1>
      <ul>
        {data.contents.map((post) => (
          <li key={post.id}>
            <Link href={`/blog/${post.id}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}