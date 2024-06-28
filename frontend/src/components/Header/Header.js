import { Link } from "react-router-dom";
import MainNav from "../MainNav/MainNav";
import styles from "./Header.module.css";


export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logoContainer2}>
        <div className={styles.logoContainer}>
          <Link to="/" className={styles.logo}> <span className={styles.title}>Todo Lists</span></Link>
        </div>
        </div>
      <MainNav />
      </div>
      
    </header>
  );
}
