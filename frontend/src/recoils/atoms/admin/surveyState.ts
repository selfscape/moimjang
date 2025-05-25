import { atom } from "recoil";

import { Question, Survey } from "interfaces/brand/survey";
import { SurveyType } from "interfaces/brand/survey";
import { v4 as uuidv4 } from "uuid";

export const initialQuestions: Question[] = [
  {
    id: uuidv4(),
    type: SurveyType.PLAINTEXT,
    text: "이름",
    description: "",
    numericOnly: false,
    isRequired: false,
  },
  {
    id: uuidv4(),
    type: SurveyType.PLAINTEXT,
    text: "성별",
    description: "예: 남성/여성/기타",
    numericOnly: false,
    isRequired: false,
  },
];

export const surveyMetaAtom = atom<Pick<Survey, "title" | "description">>({
  key: "surveyMeta",
  default: { title: "", description: "" },
});

export const surveyQuestionsAtom = atom<Question[]>({
  key: "surveyQuestions",
  default: initialQuestions,
});
