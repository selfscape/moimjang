import styled from "styled-components";
import {
  DescriptionInput,
  FieldRow,
  QuestionNumber,
  RemoveBtn,
  Switch,
  TextInput,
  ToggleContainer,
  ToggleRow,
  QuetionItem,
  OptionSection,
  AddOptionBtn,
} from "./Styles";
import { SelectQuestion, Question } from "interfaces/brand/survey";
import { FaTrash, FaTimes } from "react-icons/fa";
import useSurveyBuilder from "hooks/brand/context/useSurveyBuilder";

interface Props {
  question: Question;
  order: number;
}

const Select = ({ order, question }: Props) => {
  const { updateField, removeQuestion, updateOption, removeOption, addOption } =
    useSurveyBuilder();

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

      <OptionSection>
        {(question as SelectQuestion).options.map((opt, i) => (
          <QuetionItem key={i}>
            <TextInput
              placeholder={`항목${i + 1}`}
              value={opt}
              onChange={(e) => updateOption(question.id, i, e.target.value)}
              style={{
                fontSize: "0.8rem",
                color: "#333",
              }}
            />
            <RemoveBtn onClick={() => removeOption(question.id, i)}>
              <FaTimes color="#333" />
            </RemoveBtn>
          </QuetionItem>
        ))}
        <AddOptionBtn onClick={() => addOption(question.id)}>
          + 항목 추가
        </AddOptionBtn>
      </OptionSection>
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
            복수 선택{" "}
            <Switch
              checked={(question as SelectQuestion).multiSelect}
              onChange={(e) =>
                updateField(question.id, {
                  multiSelect: e.target.checked,
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

export default Select;
