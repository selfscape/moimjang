import styled from "styled-components";
import {
  Container,
  QuestionLabel,
  RequiredStar,
  LabelText,
  Description,
} from "./Styles";
import { DropdownQuestion, Question } from "interfaces/brand/survey";

interface Props {
  question: Question;
}

const Dropdown = ({ question }: Props) => {
  return (
    <Container>
      <QuestionLabel>
        <LabelText>{question.text || "질문을 입력해주세요."}</LabelText>
        {question?.isRequired && <RequiredStar>*</RequiredStar>}
      </QuestionLabel>

      <Description>
        {question?.description || "설명 또는 부가 정보를 입력하세요"}
      </Description>
      <SelectBox defaultValue="">
        <option value="" disabled>
          답변을 선택해주세요.
        </option>
        {(question as DropdownQuestion).options?.map((opt, idx) => (
          <option key={idx} value={opt}>
            {opt}
          </option>
        ))}
      </SelectBox>
    </Container>
  );
};

export default Dropdown;

const SelectBox = styled.select`
  width: 100%;
  padding: 12px 16px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #f5f5f5;
  appearance: none;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.25);
    background: #fff;
  }
`;
