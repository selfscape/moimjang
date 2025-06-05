"use client";
import React from "react";
import pathnames from "@/app/_constant/pathnames";
import { useRouter } from "next/navigation";

import styles from "./Profile.module.css";
import { USER_DATA } from "@/app/_constant/auth";

export default function Profile() {
  const router = useRouter();
  const user = JSON.parse(localStorage.getItem(USER_DATA) || "");

  const handleProfileEditButtonClick = () => {
    router.push(pathnames.editProfile);
  };

  return (
    <div className={styles.profilePage}>
      <main className={styles.profileContent}>
        <div className={styles.profileHeader}>
          <div className={styles.avatar}>
            {user?.gender === "male" ? "👨" : "👩"}
          </div>
          <h2 className={styles.userName}>
            {user?.username ? user?.username : "정보없음"}
          </h2>
        </div>

        <button
          className={styles.actionButton}
          onClick={handleProfileEditButtonClick}
        >
          프로필 수정하기
        </button>

        <div className={styles.profileInfo}>
          <div className={styles.profileCard}>
            <div className={styles.infoRow}>
              <span className={styles.label}>성별</span>
              <span className={styles.value}>
                {user?.gender === "male" ? "남성" : "여성" || "정보 없음"}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>출생연도</span>
              <span className={styles.value}>
                {user?.birth_year || "정보 없음"}년
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>MBTI</span>
              <span className={styles.value}>{user?.mbti || "정보 없음"}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
