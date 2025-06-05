import React from "react";

import styles from "./ErrorBox.module.css";

export default function ErrorBox() {
  return (
    <div className={styles.errorBox}>
      <p>데이터를 불러오는 중 문제가 발생했어요.</p>
      <p>잠시 후 다시 시도해 주세요.</p>
    </div>
  );
}
