import Link from "next/link";
import Blogs from "./blog/page";
import LanguageSwitch from "./components/LanguageSwitch";
import styles from "./style/page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <LanguageSwitch />
      <main>
        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <Blogs />
      </main>
    </div>
  );
}
