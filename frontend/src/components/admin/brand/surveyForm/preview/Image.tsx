import styled from "styled-components";
import {
  Container,
  QuestionLabel,
  RequiredStar,
  LabelText,
  Description,
} from "./Styles";
import { Question } from "interfaces/brand/survey";
import { FaImage } from "react-icons/fa6";

interface Props {
  question: Question;
}

const Image = ({ question }: Props) => {
  return (
    <Container>
      <QuestionLabel>
        <LabelText>{question.text || "질문을 입력해주세요."}</LabelText>
        {question?.isRequired && <RequiredStar>*</RequiredStar>}
      </QuestionLabel>

      <Description>
        {question?.description || "설명 또는 부가 정보를 입력하세요"}
      </Description>

      <UploadButton htmlFor={`file-input-${question.id}`}>
        <FaImage />
        사진 첨부
      </UploadButton>
    </Container>
  );
};

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

export default Image;
