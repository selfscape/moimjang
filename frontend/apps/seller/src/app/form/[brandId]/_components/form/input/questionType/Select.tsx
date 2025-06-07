import React from "react";
import styles from "./QuestionType.module.css";
import { SelectQuestion } from "@model/form";

interface Props {
  question: SelectQuestion;
  answer: string | string[];
  onChange: (questionId: string, value: string | string[]) => void;
}

const Select: React.FC<Props> = ({ question, answer, onChange }) => {
  const currentValue = answer;
  const isMulti = question.multiSelect;

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
      <div className={styles.optionsContainer}>
        {question.options.map((option: string) => {
          const isSelected = isMulti
            ? Array.isArray(currentValue) && currentValue.includes(option)
            : currentValue === option;

          const handleOptionChange = () => {
            if (isMulti) {
              let newSelected = Array.isArray(currentValue)
                ? [...currentValue]
                : [];
              if (isSelected) {
                newSelected = newSelected.filter(
                  (item: string) => item !== option
                );
              } else {
                newSelected.push(option);
              }
              onChange(question.id, newSelected);
            } else {
              onChange(question.id, option);
            }
          };

          return (
            <div key={option} className={styles.optionItem}>
              <label
                className={[
                  styles.modernOption,
                  isSelected ? styles.selected : "",
                  isMulti ? styles.checkbox : styles.radio,
                ].join(" ")}
              >
                <input
                  type={isMulti ? "checkbox" : "radio"}
                  checked={isSelected}
                  onChange={handleOptionChange}
                />
                {option}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Select;
