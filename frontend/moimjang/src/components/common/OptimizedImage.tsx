import React from "react";
import styled from "styled-components";

export interface OptimizedImageProps {
  src: string;
  width: number;
  height: number;
  mode?: "fit" | "fill" | "scale-down";
  alt?: string;
  onClick?: (e: any) => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  width,
  height,
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
    <StyledImg
      src={proxyUrl}
      width={width}
      height={height}
      alt={alt}
      onClick={onClick}
    />
  );
};

const StyledImg = styled.img<{ width: number; height: number }>`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  object-fit: cover;
`;

export default OptimizedImage;
