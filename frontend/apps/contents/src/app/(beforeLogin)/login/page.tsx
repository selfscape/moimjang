import logo from "../../../../public/logo.png";
import styles from "./page.module.css";
import LoginForm from "./_components/LoginForm";
import ErrorMessage from "./_components/ErrorMessage";
import OptimizedNextImage from "@ui/components/Image/OptimizedNextImage";

export default async function page() {
  return (
    <main className={styles.container}>
      <section className={styles.loginBox}>
        <OptimizedNextImage
          className={styles.logoImage}
          src={logo.src}
          alt="모임장 로고"
        />
        <h1 className={styles.title}>모임장</h1>
        <p className={styles.subtitle}>로그인해주세요</p>
        <ErrorMessage />
        <LoginForm />
      </section>
    </main>
  );
}
