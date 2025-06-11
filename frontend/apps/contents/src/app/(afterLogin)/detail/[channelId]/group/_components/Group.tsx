"use client";

import React from "react";
import styles from "./Group.module.css";
import { FaUsers } from "react-icons/fa";
import { findMyGroup, getGenderEmoji } from "../_util";
import useCookie from "@util/hooks/useCookie";
import { USER_NAME } from "@constants/auth";
import { useParams } from "next/navigation";
import useGetGroups from "../_api/useGetGroups";
import Loading from "@ui/components/Spinner/FadeLoader";
import ErrorBox from "@ui/components/Error/ErrorBox";
import HeaderConfigurator from "@ui/components/Header/HeaderConfigurator";
import { USER_DATA } from "@/app/_constant/auth";

export default function Group() {
  const user = JSON.parse(localStorage.getItem(USER_DATA) || "");
  const owner = useCookie(OWNER);
  const { channelId } = useParams();
  const { data, isLoading, isError, refetch } = useGetGroups(owner, channelId);
  const myGroup = user?.id && data?.length ? findMyGroup(user.id, data) : null;

  if (isLoading) return <Loading />;
  if (isError) return <ErrorBox />;

  return (
    <>
      <HeaderConfigurator
        config={{
          title: "조 확인하기",
          onBack: true,
          onRefresh: refetch,
        }}
      />
      <div className={styles.container}>
        <div className={styles.groupStatus}>
          <div className={styles.groupInfo}>
            <div className={styles.groupIcon}>
              <FaUsers size={24} />
            </div>
            {myGroup ? (
              <div className={styles.groupText}>
                <h3>{myGroup?.group_name}</h3>
                <p>{myGroup?.joined_users.length}명</p>
              </div>
            ) : (
              <div className={styles.groupText}>그룹지정 중입니다..</div>
            )}
          </div>
        </div>

        {myGroup ? (
          <div className={styles.membersSection}>
            <h2>함께하는 멤버</h2>
            {myGroup.joined_users.map((member) => (
              <div key={member.id} className={styles.memberCard}>
                <div className={styles.memberGender}>
                  {getGenderEmoji(member.gender)}
                </div>
                <span className={styles.memberName}>{member.username}</span>
              </div>
            ))}
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
