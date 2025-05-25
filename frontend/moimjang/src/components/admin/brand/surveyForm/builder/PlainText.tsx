import styled from "styled-components";
import { FaTrash } from "react-icons/fa";
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
import { PlaintextQuestion, Question } from "interfaces/brand/survey";
import useSurveyBuilder from "hooks/admin/brand/context/useSurveyBuilder";

interface Props {
  question: Question;
  order: number;
}

const PlainText = ({ order, question }: Props) => {
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
      <ToggleRow>
        <ToggleContainer>
          <label>
            답변 필수{" "}
            <Switch
              checked={question.isRequired}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateField(question.id, { isRequired: e.target.checked })
              }
            />
          </label>
          <label>
            숫자만 입력{" "}
            <Switch
              checked={(question as PlaintextQuestion).numericOnly}
              onChange={(e) =>
                updateField(question.id, {
                  numericOnly: e.target.checked,
                })
              }
            />
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

export default PlainText;
