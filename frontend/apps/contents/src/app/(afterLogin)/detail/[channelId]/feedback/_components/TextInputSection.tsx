import React from "react";
import styles from "./TextInputSection.module.css";
import { ReviewField } from "../_model";

interface Props {
  label: string;
  field: keyof ReviewField;
  state: string;
  onChange: (
    field: keyof ReviewField
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function TextInputSection({
  label,
  field,
  state,
  onChange,
}: Props) {
  return (
    <div className={styles.questionSection}>
      <h3 className={styles.label}>{label}</h3>
      <input
        type="text"
        className={styles.input}
        value={state}
        onChange={onChange(field)}
      />
    </div>
  );
}
