import Link from "next/link";
import LanguageSwitch from "../components/LanguageSwitch";
import styles from "../style/page.module.css";
import Blogs from "../blog/page";

export default function HomeEn() {
  return (
    <div className={styles.page}>
      <LanguageSwitch />
      <main>
        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/en/about">About</Link>
          <Link href="/en/contact">Contact</Link>
          <Blogs />
        </div>
      </main>
    </div>
  );
}
