import React from "react";
import styled from "styled-components";
import { FaImage, FaTrash, FaArrowsRotate } from "react-icons/fa6";
import { ImageQuestion } from "interfaces/landing";

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
    <Container>
      <Title>{question.text}</Title>
      {question.description && (
        <Description>{question.description}</Description>
      )}
      <HiddenFileInput
        id={`file-input-${question.id}`}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files ? e.target.files[0] : null;
          onChange(question.id, file);
        }}
      />
      {answer ? (
        <ImagePreviewContainer>
          <ImagePreview src={previewUrl!} alt="preview" />
          <RoundPrevButton
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              width: "30px",
              height: "30px",
              margin: "0",
            }}
            onClick={() => onChange(question.id, null)}
          >
            <FaTrash />
          </RoundPrevButton>
          <RoundPrevButton
            style={{
              position: "absolute",
              bottom: "8px",
              right: "8px",
              width: "30px",
              height: "30px",
              margin: "0",
            }}
            onClick={() =>
              document.getElementById(`file-input-${question.id}`)?.click()
            }
          >
            <FaArrowsRotate />
          </RoundPrevButton>
        </ImagePreviewContainer>
      ) : (
        <UploadButton htmlFor={`file-input-${question.id}`}>
          <FaImage />
          사진 첨부
        </UploadButton>
      )}
    </Container>
  );
};

const Container = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
`;

const Title = styled.h2`
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
`;

const Description = styled.p`
  margin: 0 0 16px 0;
  font-size: 14px;
  line-height: 1.4;
  color: #666;
  white-space: pre-line;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const UploadButton = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;

  position: relative;

  padding: 13px 0;
  border-radius: 8px;
  border: 1px solid rgba(34, 34, 34, 0.5);

  font-weight: 700;
  font-size: 15px;
  line-height: 20px;
  text-align: center;
`;

const ImagePreviewContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const ImagePreview = styled.img`
  width: 100%;
  max-width: 430px;
  height: auto;
  border-radius: 4px;
`;

const RoundPrevButton = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #192020;
  color: #fff;
  border: none;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;

export default Image;
