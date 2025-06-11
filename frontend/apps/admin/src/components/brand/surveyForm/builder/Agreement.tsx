import {
  DescriptionInput,
  FieldRow,
  QuestionNumber,
  RemoveBtn,
  Switch,
  TextInput,
  ToggleContainer,
  ToggleRow,
} from "./Styles";
import { AgreementQuestion, Question } from "interfaces/brand/survey";
import { FaTrash } from "react-icons/fa";
import styled from "styled-components";

import useSurveyBuilder from "hooks/brand/context/useSurveyBuilder";

interface Props {
  question: Question;
  order: number;
}

const Agreement = ({ order, question }: Props) => {
  const { updateField, removeQuestion } = useSurveyBuilder();

  return (
    <Container>
      <FieldRow>
        <QuestionNumber>{order + 1}.</QuestionNumber>
        <TextInput
          id={`question-${question.id}-text`}
          placeholder="질문을 입력하세요"
          value={question.text}
          onChange={(e) => updateField(question.id, { text: e.target.value })}
        />
      </FieldRow>

      <DescriptionInput
        id={`question-${question.id}-desc`}
        placeholder="설명 또는 부가 정보를 입력하세요"
        value={question.description}
        onChange={(e) =>
          updateField(question.id, { description: e.target.value })
        }
      />

      <InfoContainer>
        <InfoField>
          <InfoLabel>수집 항목</InfoLabel>
          <InfoInput
            placeholder="ex) 이름, 연락처"
            value={(question as AgreementQuestion).personalInfoItems}
            onChange={(e) =>
              updateField(question.id, {
                personalInfoItems: e.target.value,
              })
            }
          />
        </InfoField>

        <InfoField>
          <InfoLabel>수집 및 이용 목적</InfoLabel>
          <InfoInput
            placeholder="ex) 이벤트 진행 및 당첨자 안내"
            value={(question as AgreementQuestion).purposeOfUse}
            onChange={(e) =>
              updateField(question.id, {
                purposeOfUse: e.target.value,
              })
            }
          />
        </InfoField>

        <InfoField>
          <InfoLabel>보유 및 이용 기간</InfoLabel>
          <InfoInput
            placeholder="ex) 당첨자 발표 후 1개월 보관"
            value={(question as AgreementQuestion).retentionPeriod}
            onChange={(e) =>
              updateField(question.id, {
                retentionPeriod: e.target.value,
              })
            }
          />
        </InfoField>
      </InfoContainer>

      <ToggleRow>
        <ToggleContainer>
          <label>
            답변 필수
            <Switch checked={true} onChange={() => {}} disabled={true} />
          </label>
        </ToggleContainer>
        <RemoveBtn onClick={() => removeQuestion(question.id)}>
          <FaTrash color="#333" />
        </RemoveBtn>
      </ToggleRow>
    </Container>
  );
};

const Container = styled.div``;

const InfoContainer = styled.div`
  margin-top: 32px;
`;

const InfoField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 1rem;
`;

const InfoInput = styled.input`
  width: 100%;
  border: none;
  border-bottom: 1px solid #555;
  padding: 12px 0;
  font-size: 14px;
  font-family: "SUIT", sans-serif;
`;

const InfoLabel = styled.label`
  width: 100%;
  font-size: 14px;
  line-height: 15px;
  font-weight: 700;
`;

export default Agreement;
