"use client";

import React from "react";
import styles from "./HomeButton.module.css";
import { useRouter } from "next/navigation";
import pathnames from "@/constant/pathnames";

export default function HomeButton() {
  const router = useRouter();

  return (
    <button
      className={styles.actionButton}
      onClick={() => router.push(pathnames.home)}
    >
      홈으로 돌아가기
    </button>
  );
}
