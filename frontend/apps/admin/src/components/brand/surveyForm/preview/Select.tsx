import { Question, SelectQuestion } from "interfaces/brand/survey";
import {
  Container,
  QuestionLabel,
  RequiredStar,
  LabelText,
  Description,
} from "./Styles";
import styled from "styled-components";

interface Props {
  question: Question;
}

const Select = ({ question }: Props) => {
  return (
    <Container>
      <QuestionLabel>
        <LabelText>{question.text || "질문을 입력해주세요."}</LabelText>
        {question?.isRequired && <RequiredStar>*</RequiredStar>}
      </QuestionLabel>
      <Description>
        {question?.description || "설명 또는 부가 정보를 입력하세요"}
      </Description>

      {(question as SelectQuestion)?.options?.map((opt, idx) => (
        <OptionRow key={idx}>
          <Circle />
          <OptionText>{opt || `옵션 ${idx + 1}`}</OptionText>
        </OptionRow>
      ))}
    </Container>
  );
};

export default Select;

const OptionRow = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 12px;
  transition: background 0.2s ease;

  &:hover {
    background: #f1f1f1;
  }
`;

const Circle = styled.div`
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border: 2px solid #ccc;
  border-radius: 50%;
  margin-right: 12px;
  background: #fff;
`;

const OptionText = styled.span`
  font-size: 16px;
  color: #333;
  font-weight: 500;
  line-height: 1.4;
`;
