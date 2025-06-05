import React from "react";
import styles from "./HasNoSocialing.module.css";
import { FaRegCalendarTimes } from "react-icons/fa";

export default function HasNoSocialing() {
  return (
    <div className={styles.noSocialing}>
      <FaRegCalendarTimes className={styles.noSocialingIcon} />
      <p className={styles.noSocialingText}>진행 중인 소셜링이 없습니다.</p>
      <p className={styles.noSocialingSubtext}>
        새로운 모임을 곧 추가할 예정이니,
        <br />
        잠시만 기다려주세요.
      </p>
    </div>
  );
}
