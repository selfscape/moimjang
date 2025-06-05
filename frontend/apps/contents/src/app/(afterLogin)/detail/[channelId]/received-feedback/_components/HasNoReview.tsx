import React from "react";
import styles from "./HasNoReview.module.css";
import { noReviewUsers } from "../_constants";
import ReviewCard from "./ReviewCard";
import { Review } from "@model/channel/review";
import { USER_DATA } from "@/app/_constant/auth";

export default function HasNoReview() {
  const user = JSON.parse(localStorage.getItem(USER_DATA) || "");

  const userGender = user?.gender === "male" ? "🙋" : "🙋‍♀️";

  return (
    <div className={styles.container}>
      <div className={styles.welcomeMessage}>
        <p>
          안녕하세요 {userGender}
          <strong>{user?.username}</strong>님,
        </p>
        <p>
          총 <strong>2</strong>개의 후기가 도착했어요.
        </p>
        <p>후기 작성자들의 첫인상과 </p>
        <p>대화 내용을 확인해보세요.</p>
      </div>
      {noReviewUsers.map((review: Review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
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
    </div>
  );
}
