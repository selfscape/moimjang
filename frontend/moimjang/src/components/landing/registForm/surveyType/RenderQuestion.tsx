import React from "react";
import PlainText from "./PlainText";
import Select from "./Select";
import Dropdown from "./Dropdown";
import Image from "./Image";
import Agreement from "./Agreement";
import { SurveyType, Question } from "interfaces/landing";

interface RenderQuestionProps {
  question: Question;
  answer: any;
  onChange: (questionId: string, value: any) => void;
}

const RenderQuestion: React.FC<RenderQuestionProps> = ({
  question,
  answer,
  onChange,
}) => {
  switch (question.type) {
    case SurveyType.PLAINTEXT:
      return (
        <PlainText
          question={question}
          answer={answer || ""}
          onChange={onChange}
        />
      );
    case SurveyType.SELECT:
      return (
        <Select question={question} answer={answer || ""} onChange={onChange} />
      );
    case SurveyType.DROPDOWN:
      return (
        <Dropdown
          question={question}
          answer={answer || ""}
          onChange={onChange}
        />
      );
    case SurveyType.IMAGE:
      return (
        <Image question={question} answer={answer || ""} onChange={onChange} />
      );

    case SurveyType.AGREEMENT:
      return (
        <Agreement
          question={question}
          answer={answer || false}
          onChange={onChange}
        />
      );
    default:
      return null;
  }
};

export default RenderQuestion;
