import React, { CSSProperties } from "react";
import styles from "./OptimizedImage.module.css";

export interface OptimizedImageProps {
  src: string;
  width: number;
  height: number;
  style: CSSProperties;
  mode?: "fit" | "fill" | "scale-down";
  alt?: string;
  onClick?: (e: any) => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  width,
  height,
  style,
  mode = "fit",
  alt,
  onClick,
}) => {
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
  const scaledW = Math.floor(width * dpr);
  const scaledH = Math.floor(height * dpr);

  const encoded = btoa(unescape(encodeURIComponent(src)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const proxyUrl = `https://cdn.chanyoung.site/insecure/rs:${mode}:${scaledW}:${scaledH}/${encoded}`;

  return (
    <img
      className={styles.img}
      style={style}
      src={proxyUrl}
      width={width}
      height={height}
      alt={alt}
      onClick={onClick}
    />
  );
};

export default OptimizedImage;
