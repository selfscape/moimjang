"use client";

import React from "react";
import { useParams } from "next/navigation";

import styles from "./Game.module.css";
import useGetMatchedUser from "../_api/useGetMatchedUser";
import useCookie from "@util/hooks/useCookie";
import { USER_NAME } from "@constants/auth";

import explainGameRule0 from "@/app/_asset/game-0.png";
import explainGameRule1 from "@/app/_asset/game-1.png";
import explainGameRule2 from "@/app/_asset/game-2.png";
import ErrorBox from "@ui/components/Error/ErrorBox";
import Loading from "@ui/components/Spinner/FadeLoader";
import HeaderConfigurator from "@ui/components/Header/HeaderConfigurator";
import OptimizedNextImage from "@ui/components/Image/OptimizedNextImage";

export default function Game() {
  const { channelId } = useParams();
  const owner = useCookie(OWNER);
  const { data, isError, isLoading, refetch } = useGetMatchedUser(
    channelId,
    owner
  );

  if (isError) return <ErrorBox />;
  if (isLoading) return <Loading />;

  const matchedUser = data?.[0]?.matched_user;
  const matchedUserName = matchedUser?.username || null;
  const matchedUserGender = matchedUser?.gender === "male" ? "🙋‍♂️" : "🙋‍♀️";

  return (
    <>
      <HeaderConfigurator
        config={{ title: "첫인상 게임", onBack: true, onRefresh: refetch }}
      />
      <div className={styles.container}>
        <div className={`${styles.imageWrapper} ${styles.bottomMargin}`}>
          <OptimizedNextImage
            className={styles.memberImage}
            src={explainGameRule0.src}
            alt="매치 유저 설명"
          />
          <div className={styles.memberCard}>
            {matchedUserName ? (
              <>
                <div className={styles.memberGender}>{matchedUserGender}</div>
                <span className={styles.memberName}>{matchedUserName}</span>
              </>
            ) : (
              <span className={styles.memberName}>???</span>
            )}
          </div>
        </div>
        <div className={styles.imageWrapper}>
          <OptimizedNextImage
            className={styles.image}
            src={explainGameRule1.src}
            alt="누가? 누구를"
            style={{
              height: "auto",
            }}
          />
          <OptimizedNextImage
            className={styles.image}
            src={explainGameRule2.src}
            alt="누가? 누구를"
            style={{
              height: "auto",
            }}
          />
        </div>
      </div>
    </>
  );
}
