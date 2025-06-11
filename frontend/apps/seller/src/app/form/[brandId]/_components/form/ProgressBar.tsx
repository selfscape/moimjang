import React from "react";
import styles from "./ProgressBar.module.css";
import { FaArrowLeft } from "react-icons/fa";

interface Props {
  currentIndex: number;
  handlePrevious: () => void;
  progressPercentage: number;
}

export default function ProgressBar({
  currentIndex,
  handlePrevious,
  progressPercentage,
}: Props) {
  return (
    <div className={styles.progressBar}>
      <button
        className={styles.roundPrevButton}
        onClick={handlePrevious}
        disabled={currentIndex === 0}
      >
        <FaArrowLeft />
      </button>
      <div className={styles.progressContainer}>
        <div
          className={styles.progressBarStyled}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
}
