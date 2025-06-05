import React from "react";
import styles from "./ActionButtons.module.css";
import { ChannelFeatureButton } from "@model/channel";
import {
  FaUsers,
  FaGamepad,
  FaComments,
  FaBoxOpen,
  FaPenNib,
  FaPencilAlt,
} from "react-icons/fa";
import { useRouter } from "next/navigation";

interface Props {
  visible_components: Array<ChannelFeatureButton>;
  channelId: string | string[] | undefined;
  brandId: number;
}

export default function ActionButtons({
  visible_components,
  channelId,
  brandId,
}: Props) {
  const router = useRouter();
  if (visible_components?.length === 0)
    return (
      <div className={styles.emptyState}>
        <h2 className={styles.emptyTitle}>컨텐츠를 준비 중입니다.</h2>
        <span className={styles.emptyDescription}>잠시만 기다려주세요.</span>
      </div>
    );

  const handleButtonClick = (component: string, brandId?: number) => {
    if (!channelId) return;
    let url = `./${channelId}/${component}`;

    if (brandId) {
      url += `?brandId=${brandId}`;
    }

    router.push(url);
  };

  return (
    <div className={styles.actionButtons}>
      {visible_components.includes(ChannelFeatureButton.GROUP) && (
        <button
          className={styles.actionButton}
          onClick={() => handleButtonClick("group")}
        >
          <FaUsers />
          <span className={styles.buttonText}>조 확인하기</span>
        </button>
      )}

      {visible_components.includes(ChannelFeatureButton.QUESTION_CARD) && (
        <button
          className={styles.actionButton}
          onClick={() => handleButtonClick("contents", brandId)}
        >
          <FaBoxOpen />
          <span className={styles.buttonText}>컨텐츠 박스</span>
        </button>
      )}

      {visible_components.includes(ChannelFeatureButton.MATCHLOG) && (
        <button
          className={styles.actionButton}
          onClick={() => handleButtonClick("game")}
        >
          <FaGamepad />
          <span className={styles.buttonText}>첫인상 게임</span>
        </button>
      )}

      {visible_components.includes(ChannelFeatureButton.REVIEW_FORM) && (
        <button
          className={styles.actionButton}
          onClick={() => handleButtonClick("feedback")}
        >
          <FaPenNib />
          <span className={styles.buttonText}>대화 후기 남기기</span>
        </button>
      )}

      {visible_components.includes(ChannelFeatureButton.REVIEW_LIST) && (
        <button
          className={styles.actionButton}
          onClick={() => handleButtonClick("received-feedback")}
        >
          <FaComments />
          <span className={styles.buttonText}>대화 후기 확인하기</span>
        </button>
      )}

      {visible_components.includes(ChannelFeatureButton.WRITE_REVIEW) && (
        <button
          className={styles.actionButton}
          onClick={() => handleButtonClick("write-review", brandId)}
        >
          <FaPencilAlt />
          <span className={styles.buttonText}>리뷰 작성하기</span>
        </button>
      )}
    </div>
  );
}
