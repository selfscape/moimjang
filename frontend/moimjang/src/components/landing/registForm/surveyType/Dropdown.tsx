import React from "react";
import styled from "styled-components";
import { DropdownQuestion } from "interfaces/landing";

interface DropdownProps {
  question: DropdownQuestion;
  answer: string;
  onChange: (questionId: string, value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ question, answer, onChange }) => {
  return (
    <Container>
      <Title>{question.text}</Title>
      {question.description && (
        <Description>{question.description}</Description>
      )}
      <Select
        value={answer}
        onChange={(e) => onChange(question.id, e.target.value)}
      >
        <option value="" disabled>
          선택해주세요
        </option>
        {question.options.map((option, idx) => (
          <option key={idx} value={option}>
            {option}
          </option>
        ))}
      </Select>
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
  color: #666;
  white-space: pre-line;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  font-size: 14px;
  color: #666;
  white-space: pre-line;
`;

export default Dropdown;
