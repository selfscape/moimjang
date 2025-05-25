import React, { useEffect } from "react";
import styled from "styled-components";

import { SurveyType } from "interfaces/brand/survey";
import useSurveyBuilder from "hooks/admin/brand/context/useSurveyBuilder";
import useSaveBar from "hooks/admin/components/useSaveBar";

import PlainText from "./PlainText";
import Select from "./Select";
import Dropdown from "./Dropdown";
import Image from "./Image";
import Agreement from "./Agreement";

const Builder: React.FC = () => {
  const { questions, addQuestion } = useSurveyBuilder();

  return (
    <Container>
      <Toolbox>
        <AddButton onClick={() => addQuestion(SurveyType.PLAINTEXT)}>
          + 주관식
        </AddButton>
        <AddButton onClick={() => addQuestion(SurveyType.SELECT)}>
          + 객관식
        </AddButton>
        <AddButton onClick={() => addQuestion(SurveyType.DROPDOWN)}>
          + 드롭다운
        </AddButton>
        <AddButton onClick={() => addQuestion(SurveyType.IMAGE)}>
          + 이미지
        </AddButton>
        <AddButton onClick={() => addQuestion(SurveyType.AGREEMENT)}>
          + 동의
        </AddButton>
      </Toolbox>
      <QuestionList>
        {questions.map((q, idx) => (
          <QuestionCard>
            {q.type === SurveyType.PLAINTEXT && (
              <PlainText question={q} order={idx} />
            )}

            {q.type === SurveyType.SELECT && (
              <Select question={q} order={idx} />
            )}

            {q.type === SurveyType.DROPDOWN && (
              <Dropdown question={q} order={idx} />
            )}

            {q.type === SurveyType.IMAGE && <Image question={q} order={idx} />}

            {q.type === SurveyType.AGREEMENT && (
              <Agreement question={q} order={idx} />
            )}
          </QuestionCard>
        ))}
      </QuestionList>
    </Container>
  );
};

const Container = styled.div`
  flex: 1;
  padding: 1rem;
  display: flex;
  gap: 1rem;
  flex-direction: column;
`;

const Toolbox = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const AddButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${({ theme: { palette } }) => palette.grey700};
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const QuestionList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
`;

const QuestionCard = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  border: 1px solid #bdbdbd;
`;

export default Builder;
