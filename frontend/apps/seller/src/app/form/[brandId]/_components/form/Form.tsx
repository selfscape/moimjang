"use client";

import React, { useState } from "react";
import ProgressBar from "./ProgressBar";
import InputSection from "./input/Input";
import styles from "./Form.module.css";
import { Survey } from "@model/form";

interface Props {
  surveys: Array<Survey>;
}

export default function Form({ surveys }: Props) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  const totalQuestions = surveys[0].questions.length;
  const progressPercentage =
    totalQuestions > 1 ? (currentIndex / (totalQuestions - 1)) * 100 : 100;

  return (
    <div className={styles.formSection}>
      <ProgressBar
        currentIndex={currentIndex}
        handlePrevious={handlePrevious}
        progressPercentage={progressPercentage}
      />
      <InputSection
        surveys={surveys}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />
    </div>
  );
}
