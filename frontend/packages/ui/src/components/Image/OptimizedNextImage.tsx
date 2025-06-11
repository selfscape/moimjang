"use client";

import Image from "next/image";
import React from "react";

interface OptimizedNextImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  blur?: boolean;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  loading?: "lazy" | "eager";
  objectFit?: React.CSSProperties["objectFit"];
  objectPosition?: React.CSSProperties["objectPosition"];
}

const OptimizedNextImage: React.FC<OptimizedNextImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  style,
  blur,
  priority,
  quality,
  sizes,
  loading,
  objectFit,
  objectPosition,
}) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={width || 430}
      height={height || 430}
      className={className}
      priority={priority}
      quality={quality}
      sizes={sizes ?? "(max-width: 768px) 100vw, 430px"}
      loading={loading ?? "lazy"}
      placeholder={blur ? "blur" : "empty"}
      blurDataURL={
        blur
          ? "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII="
          : undefined
      }
      style={{
        objectFit,
        objectPosition,
        ...style,
      }}
    />
  );
};

export default OptimizedNextImage;
