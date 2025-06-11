import React from "react";
import GalleryImageList from "./GalleryImageList";
import styles from "./GallerySection.module.css";

export default function GallerySection() {
  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>갤러리</h2>
      <GalleryImageList />
    </div>
  );
}
