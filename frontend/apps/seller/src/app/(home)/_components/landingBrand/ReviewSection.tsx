"use client";

import React from "react";
import useGetBrandReviews from "@/app/_api/brand/useGetBrandReviews";
import PhotoReview from "@/app/_components/PhotoReview";
import { getPhotoReviews } from "@/app/util/getPhotoReviews";
import LoadingSpinner from "@ui/components/Spinner/FadeLoader";
import ErrorBox from "@ui/components/Error/ErrorBox";

export default function ReviewSecrion() {
  const { data, isError, isLoading } = useGetBrandReviews();

  if (isLoading) return <LoadingSpinner style={{ height: "300px" }} />;
  if (isError) return <ErrorBox />;

  const reviews = data?.reviews || [];

  if (reviews.length) {
    return <PhotoReview reviews={getPhotoReviews(reviews)} />;
  }
}
