"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./Form.module.css";
import { ReviewField } from "../_model";
import CheckboxOptions from "./CheckboxOptions";
import TextInputSection from "./TextInputSection";

import {
  styleOptions,
  firstImpressionOptions,
  memorablePartOptions,
  keywordOptions,
} from "../_constants";
import { useReviewStore } from "../_store/useReviewStore";
import useGetGroups from "../_api/useGetGroups";
import { useParams } from "next/navigation";
import useCookie from "@util/hooks/useCookie";
import { useSystemModalStore } from "@ui/store/useSystemModalStore";
import pathnames from "@/app/_constant/pathnames";
import useCreateReview from "../_api/useCreateReview";
import { USER_DATA } from "@/app/_constant/auth";
import { OWNER } from "@constants/auth";

export default function Form() {
  const router = useRouter();
  const { channelId } = useParams();
  const owner = useCookie(OWNER);

  const user = JSON.parse(localStorage.getItem(USER_DATA) || "");
  const { data } = useGetGroups(channelId, owner);
  const { mutate: createReview } = useCreateReview(owner);
  const groupMembers = data?.[0]?.joined_users || [];
  const { open } = useSystemModalStore();

  const {
    setField,
    toggleField,
    selectedParticipant,
    style,
    impression,
    conversation,
    keywords,
    instagram,
    kakao,
    phoneNumber,
    isAnonymous,
  } = useReviewStore();
  const [errors, setErrors] = useState<
    Partial<Record<keyof ReviewField, string>>
  >({});

  const participantRef = useRef<HTMLDivElement>(null);
  const styleRef = useRef<HTMLDivElement>(null);
  const impressionRef = useRef<HTMLDivElement>(null);
  const conversationRef = useRef<HTMLDivElement>(null);
  const keywordRef = useRef<HTMLDivElement>(null);
  const isAnonymousRef = useRef<HTMLDivElement>(null);

  const removeError = (field: keyof ReviewField) => {
    if (errors[field]) {
      setErrors((prev) => {
        const o = { ...prev };
        delete o[field];
        return o;
      });
    }
  };

  const handleCheckboxToggle = (
    field: "style" | "impression" | "conversation" | "keywords",
    value: string
  ) => {
    removeError(field);
    toggleField(field, value);
  };

  const handleInputChange =
    (field: keyof ReviewField) => (e: React.ChangeEvent<HTMLInputElement>) => {
      removeError(field);
      setField(field, e.target.value);
    };

  const handleRadioChange = (value: boolean) => {
    removeError("isAnonymous");
    setField("isAnonymous", value);
  };

  const handleSubmit = () => {
    const newErr: Partial<Record<keyof ReviewField, string>> = {};
    if (!selectedParticipant)
      newErr.selectedParticipant = "필수 입력값 입니다.";
    if (!style.length) newErr.style = "필수 입력값 입니다.";
    if (!impression.length) newErr.impression = "필수 입력값 입니다.";
    if (!conversation.length) newErr.conversation = "필수 입력값 입니다.";
    if (!keywords.length) newErr.keywords = "필수 입력값 입니다.";
    if (isAnonymous === undefined) newErr.isAnonymous = "필수 선택값 입니다.";

    if (Object.keys(newErr).length) {
      setErrors(newErr);
      const scrollMap: Record<string, React.RefObject<HTMLDivElement>> = {
        selectedParticipant: participantRef,
        style: styleRef,
        impression: impressionRef,
        conversation: conversationRef,
        keywords: keywordRef,
        isAnonymous: isAnonymousRef,
      };
      const first = Object.keys(newErr)[0] as keyof ReviewField;
      scrollMap[first]?.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    const additional_info = `${instagram ? `Instagram: ${instagram}, ` : ""}${
      kakao ? `Kakao: ${kakao}, ` : ""
    }${phoneNumber ? `Phone: ${phoneNumber}` : ""}`;

    createReview(
      {
        requestBody: {
          target_user_id: Number(selectedParticipant) || null,
          reviewer_user_id: user?.id || null,
          channel_id: Number(channelId),
          style: style.join(", "),
          impression: impression.join(", "),
          conversation: conversation.join(", "),
          keywords: keywords.join(", "),
          additional_info,
          is_reviewer_anonymous: isAnonymous,
        },
      },
      {
        onSuccess: () => {
          open({
            isOpen: true,
            title: "피드백 제출 완료",
            message: "계속 작성하시겠습니까?",
            showCancel: true,
            onConfirm: () => {
              setErrors({});
              window.scrollTo({ top: 0, behavior: "smooth" });
            },
            onCancel: () => router.push(`${pathnames.detail}/${channelId}`),
          });
        },
      }
    );
  };

  return (
    <div className={styles.container}>
      <div ref={participantRef} className={styles.questionSection}>
        <h3 className={styles.label}>
          참여자 선택 <span className={styles.requiredMark}>*</span>
        </h3>
        {errors.selectedParticipant && (
          <p className={styles.errorMessage}>{errors.selectedParticipant}</p>
        )}
        <select
          className={styles.select}
          value={selectedParticipant}
          onChange={(e) => {
            removeError("selectedParticipant");
            setField("selectedParticipant", e.target.value);
          }}
        >
          <option value="">선택해주세요</option>
          {groupMembers.map(({ id, username, gender }) => (
            <option key={id} value={id}>
              {gender === "male" ? "🙋‍♂️" : "🙋‍♀️"}
              {username}
            </option>
          ))}
        </select>
      </div>

      {/* 스타일, 첫인상, 대화 내용 */}
      <CheckboxOptions
        options={styleOptions}
        field={"style"}
        label={"그분의 옷차림과 스타일은 어떤 느낌이었나요?"}
        refProp={styleRef}
        errors={errors}
        state={style}
      />

      <CheckboxOptions
        options={firstImpressionOptions}
        field={"impression"}
        label={"그분에게 어떤 첫인상을 받으셨나요?"}
        refProp={impressionRef}
        errors={errors}
        state={impression}
      />

      <CheckboxOptions
        options={memorablePartOptions}
        field={"conversation"}
        label={"대화 중에서 특히 기억에 남거나 와닿는 부분이 있었나요?"}
        refProp={conversationRef}
        errors={errors}
        state={conversation}
      />

      {/* 키워드 */}
      <div ref={keywordRef} className={styles.questionSection}>
        <h3 className={styles.label}>
          그분과 어울리는 키워드를 골라주세요{" "}
          <span className={styles.requiredMark}>*</span>
        </h3>
        {errors.keywords && (
          <p className={styles.errorMessage}>{errors.keywords}</p>
        )}
        <div className={styles.keywordContainer}>
          {keywordOptions.map((kw) => {
            const sel = keywords.includes(kw);
            return (
              <button
                key={kw}
                className={`${styles.keywordButton} ${
                  sel ? styles.keywordButtonSelected : ""
                }`}
                onClick={() => handleCheckboxToggle("keywords", kw)}
              >
                {kw}
              </button>
            );
          })}
        </div>
      </div>

      {/* 익명 여부 */}
      <div ref={isAnonymousRef} className={styles.questionSection}>
        <h3 className={styles.label}>설문 결과를 익명으로 하시겠어요?</h3>
        {errors.isAnonymous && (
          <p className={styles.errorMessage}>{errors.isAnonymous}</p>
        )}
        <div className={styles.radioContainer}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="anonymous"
              checked={isAnonymous === true}
              onChange={() => handleRadioChange(true)}
            />
            예
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="anonymous"
              checked={isAnonymous === false}
              onChange={() => handleRadioChange(false)}
            />
            아니요
          </label>
        </div>
      </div>

      {/* 추가 연락처 */}
      <div className={styles.questionSection}>
        <h3 className={styles.label}>앞으로 친하게 지내요!</h3>
        <p className={styles.description}>
          앞으로도 친하게 지내고 싶다면 인스타그램, 카카오톡 또는 전화번호를
          남겨주세요. 서로 연락하며 더 좋은 인연을 이어갈 수 있을 거예요! 😊
          <br />
          (입력은 선택사항입니다.)
        </p>
        <TextInputSection
          label="인스타그램 아이디"
          field={"instagram"}
          state={instagram}
          onChange={handleInputChange}
        />
        <TextInputSection
          label="카카오톡 아이디"
          field={"kakao"}
          state={kakao}
          onChange={handleInputChange}
        />

        <TextInputSection
          label="핸드폰 번호"
          field={"phoneNumber"}
          state={phoneNumber}
          onChange={handleInputChange}
        />
      </div>

      <div className={styles.buttonWrapper}>
        <button className={styles.submitButton} onClick={handleSubmit}>
          제출하기
        </button>
      </div>
    </div>
  );
}
