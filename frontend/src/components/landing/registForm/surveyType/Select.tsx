import React from "react";
import styled from "styled-components";
import { SelectQuestion } from "interfaces/landing";

interface SelectProps {
  question: SelectQuestion;
  answer: string | string[];
  onChange: (questionId: string, value: string | string[]) => void;
}

const Select: React.FC<SelectProps> = ({ question, answer, onChange }) => {
  const currentValue = answer;
  const isMulti = question.multiSelect;

  return (
    <Container>
      <Title hasDescription={Boolean(question.description)}>
        {question.text}
      </Title>
      {question.description && (
        <Description>{question.description}</Description>
      )}
      <OptionsContainer>
        {question.options.map((option: string, idx: number) => {
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
            <OptionItem key={idx}>
              <ModernOption
                data-type={isMulti ? "checkbox" : "radio"}
                isSelected={isSelected}
              >
                <input
                  type={isMulti ? "checkbox" : "radio"}
                  name={`question_${question.id}`}
                  checked={isSelected}
                  onChange={handleOptionChange}
                />
                <span>{option}</span>
              </ModernOption>
            </OptionItem>
          );
        })}
      </OptionsContainer>
    </Container>
  );
};

const Container = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
`;

const Title = styled.h2<{ hasDescription: boolean }>`
  margin: 0 0 ${({ hasDescription }) => (hasDescription ? "8px" : "16px")} 0;
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

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const OptionItem = styled.div`
  margin-bottom: 16px;
`;

const ModernOption = styled.label<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #333;
  white-space: pre-line;
  cursor: pointer;
  position: relative;
  padding-left: 30px;

  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
  }

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 18px;
    height: 18px;
    border: 2px solid ${({ isSelected }) => (isSelected ? "#111" : "#ccc")};
    border-radius: ${(props) =>
      props["data-type"] === "radio" ? "50%" : "4px"};
    background-color: ${({ isSelected }) => (isSelected ? "#111" : "#fff")};
    transition: all 0.3s ease;
  }

  &:hover::before {
    border-color: #111;
  }

  & span {
    display: inline-block;
  }
`;

export default Select;
