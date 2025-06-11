import React from "react";
import styles from "./Header.module.css";
import OptimizedImage from "@ui/components/Image/OptimizedNextImage";
import { Brand } from "@model/brand";

interface Props {
  brand: Brand;
}

export default function Header({ brand }: Props) {
  return (
    <div className={styles.headerContainer}>
      <OptimizedImage
        alt="thumbnail"
        src={brand?.thumbnailImage?.url || ""}
        className={styles.logoImage}
      />
    </div>
  );
}
