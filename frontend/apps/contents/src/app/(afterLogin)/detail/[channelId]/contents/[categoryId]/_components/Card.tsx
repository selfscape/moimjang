"use client";

import React from "react";
import { useParams, useSearchParams } from "next/navigation";
import styles from "./Card.module.css";
import Carousel from "@ui/components/Swiper/SwiperSlide";
import useCookie from "@util/hooks/useCookie";
import { OWNER } from "@constants/auth";
import useGetQuestionCards from "../_api/useGetQuestionCards";
import Loading from "@ui/components/Spinner/FadeLoader";
import ErrorBox from "@ui/components/Error/ErrorBox";
import HeaderConfigurator from "@ui/components/Header/HeaderConfigurator";

export default function Card() {
  const owner = useCookie(OWNER);
  const { categoryId } = useParams();
  const categoryName = useSearchParams().get("categoryName");

  const {
    data: questionCards,
    isLoading,
    isError,
    refetch,
  } = useGetQuestionCards(categoryId, owner);

  const filteredImages = questionCards
    ?.filter((card) => card.isCardVisible)
    .map((card) => ({ id: card.id, thumbnail: card?.image?.url }));

  if (isLoading) return <Loading />;
  if (isError) return <ErrorBox />;

  if (!questionCards?.length)
    return <div className={styles.noData}>아직 컨텐츠가 없습니다.</div>;

  return (
    <>
      <HeaderConfigurator
        config={{
          title: `${categoryName || ""}`,
          onBack: true,
          onRefresh: refetch,
        }}
      />

      <div className={styles.container}>
        {filteredImages && filteredImages.length > 0 && (
          <Carousel imageList={filteredImages} />
        )}

        {filteredImages && filteredImages.length >= 2 && (
          <div className={styles.swipeHint}>옆으로 스와이프해보세요</div>
        )}
      </div>
    </>
  );
}
