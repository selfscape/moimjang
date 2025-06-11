import React from "react";
import styles from "./BrandSection.module.css";
import BrandCardList from "./BrandCardList";

export default function BrandSection() {
  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>진행중인 모임</h2>
      <div className={styles.cardContainer}>
        <BrandCardList />
      </div>
    </div>
  );
}
