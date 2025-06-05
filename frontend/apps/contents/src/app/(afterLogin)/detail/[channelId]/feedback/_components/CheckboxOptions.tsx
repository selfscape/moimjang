import React from "react";
import { ReviewField } from "../_model";
import styles from "./CheckboxOptions.module.css";
import { useReviewStore } from "../_store/useReviewStore";

interface Props {
  options: string[];
  field: "style" | "impression" | "conversation" | "keywords";
  label: string;
  refProp?: React.Ref<HTMLDivElement>;
  errors: Partial<Record<keyof ReviewField, string>>;
  state: Array<string>;
}

export default function CheckboxOptions({
  options,
  field,
  label,
  refProp,
  errors,
  state,
}: Props) {
  const { toggleField } = useReviewStore();
  return (
    <div ref={refProp} className={styles.questionSection}>
      <h3 className={styles.label}>
        {label} <span className={styles.requiredMark}>*</span>
      </h3>
      {errors[field] && <p className={styles.errorMessage}>{errors[field]}</p>}
      {options.map((opt) => (
        <label key={opt} className={styles.checkboxLabel}>
          <input
            type="checkbox"
            value={opt}
            checked={state.includes(opt)}
            onChange={() => toggleField(field, opt)}
          />
          {opt}
        </label>
      ))}
    </div>
  );
}
