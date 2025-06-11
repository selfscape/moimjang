"use client";

import React from "react";
import useGetBrandById from "../_api/useGetBrandById";
import styles from "./Thumbnail.module.css";
import Image from "@ui/components/Image/OptimizedNextImage";
import useCookie from "@util/hooks/useCookie";
import { USER_NAME } from "@constants/auth";

interface Props {
  brandId: number;
}

export default function Thumbnail({ brandId }: Props) {
  const owner = useCookie(OWNER);
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
