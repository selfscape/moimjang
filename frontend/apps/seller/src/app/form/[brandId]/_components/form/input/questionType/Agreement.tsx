import React from "react";
import styles from "./QuestionType.module.css";
import { AgreementQuestion } from "@model/form";

interface Props {
  question: AgreementQuestion;
  answer: boolean;
  onChange: (questionId: string, value: any) => void;
}

const Agreement: React.FC<Props> = ({ question, answer, onChange }) => {
  const handleAgree = () => {
    onChange(question.id, true);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{question.text}</h2>
      {question.description && (
        <p className={styles.description}>{question.description}</p>
      )}

      <div className={styles.item}>
        <div className={styles.label}>수집하는 개인정보 항목</div>
        <div className={styles.value}>{question.personalInfoItems}</div>
      </div>
      <div className={styles.item}>
        <div className={styles.label}>수집 및 이용 목적</div>
        <div className={styles.value}>{question.purposeOfUse}</div>
      </div>
      <div className={styles.item}>
        <div className={styles.label}>보유 및 이용 기간</div>
        <div className={styles.value}>{question.retentionPeriod}</div>
      </div>

      <div className={styles.footer}>
        <button
          className={`${styles.agreeButton} ${
            answer ? styles.agreeButtonActive : ""
          }`}
          onClick={handleAgree}
        >
          개인정보 수집 및 이용에 동의합니다.
        </button>
      </div>
    </div>
  );
};

export default Agreement;
