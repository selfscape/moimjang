"use client";

import React from "react";
import styles from "./ContentBox.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import useGetQuestionCardCategories from "../_api/useGetQuestionCard";
import useCookie from "@util/hooks/useCookie";
import { OWNER } from "@constants/auth";
import OptimizedNextImage from "@ui/components/Image/OptimizedNextImage";
import HeaderConfigurator from "@ui/components/Header/HeaderConfigurator";

export default function ContentBox() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const brandId = searchParams.get("brandId");

  const owner = useCookie(OWNER);

  const { data: questionCardCategories, refetch } =
    useGetQuestionCardCategories(brandId, owner);

  const handleCardClick = (categoryId: string, categoryName: string) => {
    router.push(`./contents/${categoryId}?categoryName=${categoryName}`);
  };

  return (
    <>
      <HeaderConfigurator
        config={{
          title: "컨텐츠 박스",
          onBack: true,
          onRefresh: refetch,
        }}
      />

      <div className={styles.container}>
        <div className={styles.wrapper}>
          {questionCardCategories
            ?.filter((category) => category.isDeckVisible)
            .map((category) => (
              <div
                key={category.id}
                className={styles.cardWrapper}
                onClick={() =>
                  handleCardClick(String(category.id), category.name)
                }
              >
                <OptimizedNextImage
                  src={category.coverImage?.url}
                  alt={category.name}
                  className={styles.coverImage}
                />
                <div className={styles.cardLabel}>{category.name}</div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
