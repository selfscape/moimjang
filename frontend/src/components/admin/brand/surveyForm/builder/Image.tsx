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
import { Question } from "interfaces/brand/survey";
import { FaImage, FaTrash } from "react-icons/fa";
import styled from "styled-components";

import useSurveyBuilder from "hooks/admin/brand/context/useSurveyBuilder";

interface Props {
  question: Question;
  order: number;
}

const Image = ({ order, question }: Props) => {
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

      <UploadButton>
        <FaImage />
        사진 첨부
      </UploadButton>

      <ToggleRow>
        <ToggleContainer>
          <Switch
            checked={question.isRequired}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateField(question.id, { isRequired: e.target.checked })
            }
          />
        </ToggleContainer>
        <RemoveBtn onClick={() => removeQuestion(question.id)}>
          <FaTrash color="#333" />
        </RemoveBtn>
      </ToggleRow>
    </Container>
  );
};

const Container = styled.div``;

const UploadButton = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;

  position: relative;

  margin: 12px 0px;
  padding: 13px 0;
  border-radius: 8px;
  border: 1px solid rgba(34, 34, 34, 0.5);

  font-weight: 700;
  font-size: 15px;
  line-height: 20px;
  text-align: center;
`;

export default Image;
