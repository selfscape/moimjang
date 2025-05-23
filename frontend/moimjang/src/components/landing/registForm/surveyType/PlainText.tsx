import React from "react";
import styled from "styled-components";
import { PlaintextQuestion } from "interfaces/landing";

interface PlainTextProps {
  question: PlaintextQuestion;
  answer: string;
  onChange: (questionId: string, value: string) => void;
}

const PlainText: React.FC<PlainTextProps> = ({
  question,
  answer,
  onChange,
}) => {
  return (
    <Container>
      <Title>{question.text}</Title>
      {question.description && (
        <Description>{question.description}</Description>
      )}
      <Input
        type={question.numericOnly ? "number" : "text"}
        value={answer}
        onChange={(e) => {
          let inputValue = e.target.value;
          if (question.numericOnly) {
            inputValue = inputValue.replace(/[^0-9]/g, "");
          }
          onChange(question.id, inputValue);
        }}
      />
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
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
`;

const Description = styled.p`
  margin: 0 0 16px 0;
  font-size: 14px;
  color: #666;
  white-space: pre-line;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 16px;
  font-size: 14px;
  color: #666;
  white-space: pre-line;

  /* Chrome, Safari, Edge, Opera용 스피너 제거 */
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox용 스피너 제거 */
  -moz-appearance: textfield;
`;

export default PlainText;
