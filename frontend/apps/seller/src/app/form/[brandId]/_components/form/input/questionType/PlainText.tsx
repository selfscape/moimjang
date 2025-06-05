import React from "react";
import styles from "./QuestionType.module.css";
import { PlaintextQuestion } from "@model/form";

interface Props {
  question: PlaintextQuestion;
  answer: string;
  onChange: (questionId: string, value: string) => void;
}

export default function PlainText({ question, answer, onChange }: Props) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{question.text}</h2>
      <p className={styles.description}>{question.description}</p>
      <input
        type={question.numericOnly ? "number" : "text"}
        className={styles.input}
        value={answer}
        onChange={(e) => {
          let inputValue = e.target.value;
          if (question.numericOnly) {
            inputValue = inputValue.replace(/[^0-9]/g, "");
          }
          onChange(question.id, inputValue);
        }}
      />
    </div>
  );
}
