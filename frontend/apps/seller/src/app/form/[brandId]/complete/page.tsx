import React from "react";
import styles from "./page.module.css";
import HomeButton from "./_components/HomeButton";

export default function Page() {
  return (
    <div className={styles.container}>
      <div className={styles.emoji}>🥳</div>
      <h2 className={styles.title}>신청이 완료되었습니다</h2>
      <p className={styles.message}>
        소중한 신청 감사드립니다. <br />
        빠른 시일 내에 확인 후 연락드리겠습니다.
      </p>
      <div className={styles.buttonWrapper}>
        <HomeButton />
      </div>
    </div>
  );
}
