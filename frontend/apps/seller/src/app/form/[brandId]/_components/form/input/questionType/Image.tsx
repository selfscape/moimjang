import React from "react";
import { FaImage, FaTrash, FaArrowsRotate } from "react-icons/fa6";
import styles from "./QuestionType.module.css";
import { ImageQuestion } from "@model/form";
import OptimizedNextImage from "@ui/components/Image/OptimizedNextImage";

interface ImageProps {
  question: ImageQuestion;
  answer: File | null;
  onChange: (questionId: string, file: File | null) => void;
}

const Image: React.FC<ImageProps> = ({ question, answer, onChange }) => {
  let previewUrl: string | null = null;
  if (answer) {
    previewUrl = URL.createObjectURL(answer);
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{question.text}</h2>
      {question.description && (
        <p className={styles.description}>{question.description}</p>
      )}
      <input
        className={styles.hiddenFileInput}
        id={`file-input-${question.id}`}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files ? e.target.files[0] : null;
          onChange(question.id, file);
        }}
      />
      {answer ? (
        <div className={styles.imagePreviewContainer}>
          <OptimizedNextImage
            className={styles.imagePreview}
            src={previewUrl!}
            alt="preview"
          />
          <button
            className={styles.roundPrevButton}
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              margin: "0",
            }}
            onClick={() => onChange(question.id, null)}
          >
            <FaTrash />
          </button>
          <button
            className={styles.roundPrevButton}
            style={{
              position: "absolute",
              bottom: "8px",
              right: "8px",
              margin: "0",
            }}
            onClick={() =>
              document.getElementById(`file-input-${question.id}`)?.click()
            }
          >
            <FaArrowsRotate />
          </button>
        </div>
      ) : (
        <label
          htmlFor={`file-input-${question.id}`}
          className={styles.uploadButton}
        >
          <FaImage />
          사진 첨부
        </label>
      )}
    </div>
  );
};

export default Image;
