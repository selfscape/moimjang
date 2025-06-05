import { usePathname, useRouter } from "next/navigation";
import { FaUser, FaHome } from "react-icons/fa";
import styles from "./Navigation.module.css";
import pathnames from "@/app/_constant/pathnames";

const Navigation = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleButtonClick = (pathName: string) => {
    router.push(pathName);
  };

  return (
    <nav className={styles.container}>
      <div className={styles.bottomNavContainer}>
        <button
          className={`${styles.navItem} ${
            pathname === "/" ? styles.active : ""
          }`}
          onClick={() => handleButtonClick(pathnames.home)}
        >
          <div className={styles.navIcon}>
            <FaHome />
          </div>
          <span className={styles.navText}>홈</span>
        </button>

        <button
          className={`${styles.navItem} ${
            pathname.includes(pathnames.profile) ? styles.active : ""
          }`}
          onClick={() => handleButtonClick(pathnames.profile)}
        >
          <div className={styles.navIcon}>
            <FaUser />
          </div>
          <span className={styles.navText}>프로필</span>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
