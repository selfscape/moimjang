import React from "react";
import styles from "./QuestionType.module.css";
import { DropdownQuestion } from "@model/form";

interface DropdownProps {
  question: DropdownQuestion;
  answer: string | string[];
  onChange: (questionId: string, value: string | string[]) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ question, answer, onChange }) => {
  const currentValue = answer as string;
  return (
    <div className={styles.container}>
      <h2
        className={question.description ? styles.titleWithDesc : styles.title}
      >
        {question.text}
      </h2>
      {question.description && (
        <p className={styles.description}>{question.description}</p>
      )}
      <select
        className={styles.select}
        value={currentValue}
        onChange={(e) => onChange(question.id, e.target.value)}
      >
        <option value="" disabled>
          선택해주세요
        </option>
        {question.options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
