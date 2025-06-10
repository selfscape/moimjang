import React from "react";
import styles from "./page.module.css";
import ChannelInfo from "./_components/ChannelInfo";
import OwnerCookieSetter from "@util/hooks/OwnerCookieSetter";

export default async function page() {
  return (
    <>
      <OwnerCookieSetter />
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <ChannelInfo />
        </div>
      </div>
    </>
  );
}
