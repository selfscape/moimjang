"use client";
import React from "react";
import style from "./MainImageSection.module.css";
import useGetMainImage from "../../_api/useGetMainImage";
import LoadingSpinner from "@ui/components/Spinner/FadeLoader";
import ErrorBox from "@ui/components/Error/ErrorBox";
import OptimizedImage from "@ui/components/Image/OptimizedNextImage";

export default function MainImageSection() {
  const { data, isError, isLoading } = useGetMainImage();
  const mainImage = data?.url || "";

  if (isLoading) return <LoadingSpinner style={{ height: "600px" }} />;
  if (isError) return <ErrorBox />;
  if (!mainImage) return <LoadingSpinner />;

  return (
    <div className={style.heroSection}>
      <OptimizedImage
        src={mainImage}
        alt="메인 이미지"
        objectFit={"fill"}
        priority
        loading="eager"
      />
    </div>
  );
}
