"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import styles from "./Input.module.css";
import { Survey } from "@model/form";
import { isAnswered, isSurveyArray } from "../../../_util";
import RenderQuestion from "./Questions";
import processAnswers from "../../../_util/processAnswers";
import useRegistForm from "../../../_api/useRegistForm";
import pathnames from "@/app/_constant/pathnames";

import useCookie from "@util/hooks/useCookie";
import { OWNER } from "@constants/auth";
import { useSystemModalStore } from "@ui/store/useSystemModalStore";

interface Props {
  surveys: Array<Survey>;
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
}

export default function InputSection({
  surveys,
  currentIndex,
  setCurrentIndex,
}: Props) {
  const showErrorModal = useSystemModalStore((s) => s.showErrorModal);
  const { brandId } = useParams();
  const socialingId = useSearchParams().get("socialingId");
  const owner = useCookie(OWNER);
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const { mutate: registForm } = useRegistForm();

  const handleAnswerChange = (questionId: string, value: unknown) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  if (!isSurveyArray(surveys)) {
    return <div>설문 항목이 존재하지 않습니다.</div>;
  }

  const handleNext = async () => {
    if (!isAnswered(answers[questions[currentIndex].id])) return;

    if (
      surveys &&
      surveys[0]?.questions &&
      currentIndex < surveys[0].questions.length - 1
    ) {
      setCurrentIndex(currentIndex + 1);
      return;
    }

    const response = await processAnswers(answers, owner);

    const payload = {
      channelId: socialingId || "",
      answers: response,
    };

    registForm(
      { survey_id: surveys[0]._id, requestBody: payload },
      {
        onSuccess: () => {
          router.push(pathnames.registComplete(brandId));
        },
        onError: (error) => {
          showErrorModal(`설문 폼 등록에 실패하였습니다. \n
에러 메시지 ${error.message}
            `);
        },
      }
    );
  };

  const { questions } = surveys[0];
  const currentQuestionObj = questions[currentIndex];
  const currentAnswer = answers[currentQuestionObj.id];
  const isCurrentQuestionAnswered = isAnswered(currentAnswer);
  const totalQuestions = surveys[0]?.questions?.length;

  return (
    <div className={styles.inputContainer}>
      <div className={styles.quizCount}>Q{currentIndex + 1}번</div>
      <div className={styles.animatedQuestionWrapper}>
        <RenderQuestion
          question={currentQuestionObj}
          answer={answers[currentQuestionObj.id]}
          onChange={handleAnswerChange}
        />
        <button
          className={styles.modernButton}
          onClick={handleNext}
          disabled={!isCurrentQuestionAnswered}
        >
          {currentIndex === totalQuestions - 1 ? "제출" : "다음"}
        </button>
      </div>
    </div>
  );
}
