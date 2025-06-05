"use client";

import React from "react";
import useGetGalleryImages from "../../_api/useGetGalleryImage";
import styles from "./GallerySection.module.css";
import LoadingSpinner from "@ui/components/Spinner/FadeLoader";
import ErrorBox from "@ui/components/Error/ErrorBox";
import OptimizedImage from "@ui/components/Image/OptimizedNextImage";

const GalleryImageList = () => {
  const { data, isLoading, isError } = useGetGalleryImages();

  if (isLoading) return <LoadingSpinner style={{ height: "300px" }} />;
  if (isError) return <ErrorBox />;

  const imageUrls = data?.map((img) => img.url) ?? [];
  const chunkSize = 4;
  const chunks: string[][] = [];
  for (let i = 0; i < imageUrls.length; i += chunkSize) {
    chunks.push(imageUrls.slice(i, i + chunkSize));
  }
  const trackClassNames = [
    styles.galleryTrackFast,
    styles.galleryTrackMedium,
    styles.galleryTrackSlow,
  ];

  return chunks.map((chunk, idx) => {
    const trackClassName = trackClassNames[idx] || styles.galleryTrack;
    return (
      <div
        key={idx}
        className={styles.autoScrollGallery}
        style={{
          marginBottom: idx < chunks.length - 1 ? "16px" : undefined,
        }}
      >
        <div className={trackClassName}>
          {[...chunk, ...chunk].map((url, index) => (
            <OptimizedImage
              key={`${url}-${index}`}
              className={styles.galleryItem}
              src={url}
              alt={`갤러리 이미지 ${(index % chunkSize) + 1}`}
            />
          ))}
        </div>
      </div>
    );
  });
};

export default GalleryImageList;
