import Blogs from "./blog/page";
import { About } from "./components/about/page";
import LanguageSwitch from "./components/LanguageSwitch";
import styles from "./style/page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <LanguageSwitch />
     <main>
      <Blogs />
      <About />
      </main>
    </div>
  );
}
