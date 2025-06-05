import { useRecoilState } from "recoil";
import styled from "styled-components";
import { surveyMetaAtom, surveyQuestionsAtom } from "recoils/atoms/surveyState";

import { SurveyType } from "interfaces/landing";
import PlainText from "./PlainText";
import Select from "./Select";
import Dropdown from "./Dropdown";
import Image from "./Image";
import Agreement from "./Agreement";

const Preview: React.FC = () => {
  const [meta] = useRecoilState(surveyMetaAtom);
  const [questions] = useRecoilState(surveyQuestionsAtom);

  return (
    <Container>
      <h2>{meta.title}</h2>
      <p>{meta.description}</p>
      <ol>
        {questions.map((question) => (
          <li key={question.id}>
            {question.type === SurveyType.PLAINTEXT && (
              <PlainText question={question} />
            )}

            {question.type === SurveyType.SELECT && (
              <Select question={question} />
            )}

            {question.type === SurveyType.DROPDOWN && (
              <Dropdown question={question} />
            )}

            {question.type === SurveyType.IMAGE && (
              <Image question={question} />
            )}

            {question.type === SurveyType.AGREEMENT && (
              <Agreement question={question} />
            )}
          </li>
        ))}
      </ol>
    </Container>
  );
};

const Container = styled.div`
  width: 430px;
  background: #f9f9f9;
  padding: 1rem;
  border-left: 1px solid #ddd;
  overflow-y: auto;
`;

export default Preview;
