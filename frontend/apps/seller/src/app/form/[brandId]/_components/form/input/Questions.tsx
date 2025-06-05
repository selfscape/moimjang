import React from "react";
import { Question, SurveyType } from "@model/form";
import Select from "./questionType/Select";
import PlainText from "./questionType/PlainText";
import Dropdown from "./questionType/Dropdown";
import Image from "./questionType/Image";
import Agreement from "./questionType/Agreement";

interface Props {
  question: Question;
  answer: any;
  onChange: (questionId: string, value: any) => void;
}

export default function Questions({ question, answer, onChange }: Props) {
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
}
