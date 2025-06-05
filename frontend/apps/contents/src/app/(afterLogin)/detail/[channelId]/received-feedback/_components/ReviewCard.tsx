import React from "react";
import styles from "./ReviewCard.module.css";
import { extractContact, parseList } from "../_util";
import { Review } from "@model/channel/review";

interface Props {
  review: Review;
}

export default function ReviewCard({ review }: Props) {
  const contact = extractContact(review.additional_info);
  const styleList = parseList(review.style);
  const impressionList = parseList(review.impression);
  const conversationList = parseList(review.conversation);
  const genderIcon = review.reviewer_user_gender === "male" ? "🙋‍♂️" : "🙋‍♀️";

  return (
    <div className={styles.card}>
      <div className={styles.reviewHeader}>
        <div className={styles.reviewerInfo}>
          {review.is_reviewer_anonymous
            ? "작성자:👤 비공개"
            : `작성자:${genderIcon} ${review.reviewer_user_name}`}
        </div>
      </div>

      {/* 스타일 섹션 */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <span className={styles.icon}>👕</span>스타일
        </h3>
        <ul className={styles.list}>
          {styleList.map((item, idx) => (
            <li key={idx} className={styles.listItem}>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* 첫인상 섹션 */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <span className={styles.icon}>😎</span>첫인상
        </h3>
        <ul className={styles.list}>
          {impressionList.map((item, idx) => (
            <li key={idx} className={styles.listItem}>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* 대화 중 와닿았던 부분 */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <span className={styles.icon}>💬</span>대화 중 와닿았던 부분
        </h3>
        <ul className={styles.list}>
          {conversationList.map((item, idx) => (
            <li key={idx} className={styles.listItem}>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* 키워드 */}
      {review.keywords?.trim() && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <span className={styles.icon}>💡</span>어울리는 키워드
          </h3>
          <div className={styles.keywordList}>
            {review.keywords.split(",").map((kw, idx) => (
              <span key={idx} className={styles.keyword}>
                {kw.trim()}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 연락처 */}
      {(contact.instagram || contact.kakao || contact.phone) && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>연락처</h3>
          <div className={styles.contactInfo}>
            {contact.instagram && (
              <div className={styles.contactItem}>
                <strong>Instagram:</strong>{" "}
                <a
                  href={`https://www.instagram.com/${contact.instagram.replace(
                    "@",
                    ""
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {contact.instagram}
                </a>
              </div>
            )}
            {contact.kakao && (
              <div className={styles.contactItem}>
                <strong>Kakao:</strong> {contact.kakao}
              </div>
            )}
            {contact.phone && (
              <div className={styles.contactItem}>
                <strong>Phone:</strong> {contact.phone}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
