"use client";

import React from "react";
import styles from "./Event.module.css";
import { FaGamepad, FaUsers } from "react-icons/fa";
import Thumbnail from "./Thumbnail";
import { Channel } from "@model/channel";
import useJoinChannel from "../_api/useJoinChannel";
import pathnames from "@/app/_constant/pathnames";
import { useRouter } from "next/navigation";
import { useSystemModalStore } from "@ui/store/useSystemModalStore";
import { isErrorType } from "@model/error/util/isErrorType";

interface Props {
  socialing: Channel;
}

export default function Event({ socialing }: Props) {
  const router = useRouter();
  const { mutate: joinChannel } = useJoinChannel();
  const { showErrorModal } = useSystemModalStore();

  const handleButtonClick = () => {
    joinChannel(socialing.id, {
      onSuccess: (data) => {
        if (isErrorType(data)) {
          if (data.detail === "이미 채널에 가입되어 있습니다") {
            router.push(`${pathnames.detail}/${socialing.id}`);
            return;
          }
        }

        router.push(`${pathnames.detail}/${socialing.id}`);
      },
      onError(error) {
        showErrorModal(error.message);
      },
    });
  };

  return (
    <div
      className={styles.container}
      key={socialing.id}
      onClick={handleButtonClick}
    >
      <Thumbnail brandId={socialing.brand_id} />

      <div className={styles.channelHeader}>
        <h3 className={styles.channelTitle}>{socialing.title}</h3>
      </div>

      <div className={styles.gameInfo}>
        <FaGamepad />
        <span>{socialing.description}</span>
      </div>
      <div className={styles.locationInfo}>
        <div className={styles.participantsInfo}>
          <FaUsers />
          <span>{socialing?.joined_users?.length || 0}명 참여 중</span>
        </div>
      </div>
      <button className={styles.joinButton}>참여하기</button>
    </div>
  );
}
