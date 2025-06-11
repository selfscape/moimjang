"use client";

import React from "react";
import { useParams } from "next/navigation";
import useGetReviewList from "../_api/useGetReviewList";
import styles from "./Review.module.css";
import ReviewCard from "./ReviewCard";
import useCookie from "@util/hooks/useCookie";
import { USER_NAME } from "@constants/auth";
import HasNoReview from "./HasNoReview";
import Loading from "@ui/components/Spinner/FadeLoader";
import ErrorBox from "@ui/components/Error/ErrorBox";
import { Review } from "@model/channel/review";
import HeaderConfigurator from "@ui/components/Header/HeaderConfigurator";
import { USER_DATA } from "@/app/_constant/auth";

const ReviewList: React.FC = () => {
  const user = JSON.parse(localStorage.getItem(USER_DATA) || "");
  const { channelId } = useParams();
  const owner = useCookie(OWNER);

  const {
    data: reviews,
    isError,
    isLoading,
    refetch,
  } = useGetReviewList(channelId, owner);

  const userGender = user?.gender === "male" ? "🙋" : "🙋‍♀️";
  const hasReveiws = !!reviews?.length;

  if (isError) return <ErrorBox />;
  if (isLoading) return <Loading />;

  return (
    <>
      <HeaderConfigurator
        config={{
          title: "리뷰 확인하기",
          onBack: true,
          onRefresh: refetch,
        }}
      />

      {!hasReveiws && <HasNoReview />}

      {hasReveiws && (
        <>
          <main className={styles.mainContent}>
            <div className={styles.welcomeMessage}>
              <p>
                안녕하세요 {userGender}
                <strong>{user?.username}</strong>님,
              </p>
              <p>
                총 <strong>{reviews.length}</strong>개의 후기가 도착했어요.
              </p>
              <p>후기 작성자들의 첫인상과 </p>
              <p>대화 내용을 확인해보세요.</p>
            </div>
            {reviews.map((review: Review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </main>
          <div className={styles.welcomeMessage}>
            {user?.username}님 이번 소셜링에서 <br />
            즐거운 시간 되셨나요? 😊 <br />
            <br />
            만족하셨다면, 후기로 따뜻한 한마디
            <br />
            남겨주시면 큰 힘이 될 것 같아요!
            <br />
            <br />
            여러분의 후기가 다음 모임을 <br />
            더욱 특별하게 만듭니다. 💛
          </div>
        </>
      )}
    </>
  );
};

export default ReviewList;
