"use client";

import React from "react";
import styles from "./Thubnail.module.css";
import useGetBrandById from "../../../_api/useGetBrandById";
import Image from "@ui/components/Image/OptimizedNextImage";

interface Props {
  brandId: number;
  owner: string;
}

export default function Thumbnail({ brandId, owner }: Props) {
  const { data } = useGetBrandById(brandId, owner);
  const thumbnailImage = data?.thumbnailImage;

  if (!thumbnailImage) return null;

  return (
    <Image
      className={styles.thumbnail}
      src={thumbnailImage.url}
      alt="소셜링 썸네일 이미지"
    />
  );
}
