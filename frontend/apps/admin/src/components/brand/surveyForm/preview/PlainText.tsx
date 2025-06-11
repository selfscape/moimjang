import { Question, PlaintextQuestion } from "interfaces/brand/survey";
import {
  Container,
  QuestionLabel,
  RequiredStar,
  LabelText,
  Description,
  Input,
} from "./Styles";

interface Props {
  question: Question;
}

const PlainText = ({ question }: Props) => {
  return (
    <Container>
      <QuestionLabel>
        <LabelText>{question.text || "질문을 입력해주세요."}</LabelText>
        {question.isRequired && <RequiredStar>*</RequiredStar>}
      </QuestionLabel>
      <Description>
        {question.description || "설명 또는 부가 정보를 입력하세요"}
      </Description>
      <Input
        placeholder={
          (question as PlaintextQuestion).numericOnly
            ? "숫자만 입력해주세요."
            : "답변을 입력해주세요."
        }
        disabled={true}
      />
    </Container>
  );
};

export default PlainText;
