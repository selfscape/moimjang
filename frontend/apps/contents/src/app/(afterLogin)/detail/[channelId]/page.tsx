import React from "react";
import styles from "./page.module.css";
import ChannelInfo from "./_components/ChannelInfo";

export default async function page() {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <ChannelInfo />
        </div>
      </div>
    </>
  );
}
