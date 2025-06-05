import React from "react";
import styles from "./Details.module.css";
interface Props {
  title: string;
  description: string;
}

export default function Details({ title, description }: Props) {
  if (!title && !description) return <>데이터가 존재하지 않습니다.</>;

  return (
    <div className={styles.channelInfo}>
      <div className={styles.channelInfoContent}>
        <h2 className={styles.channelName}>{title}</h2>
        <span className={styles.channelDescription}>{description}</span>
      </div>
    </div>
  );
}
