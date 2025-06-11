import { SurveyRegistState, SurveyType } from "./enums";
export type Question =
  | PlaintextQuestion
  | SelectQuestion
  | DropdownQuestion
  | ImageQuestion
  | AgreementQuestion;

interface BaseQuestion {
  id: string;
  type: SurveyType;
  text: string;
  description: string;
  isRequired: boolean;
}

export interface ImageQuestion extends BaseQuestion {
  type: SurveyType.IMAGE;
}

export interface PlaintextQuestion extends BaseQuestion {
  type: SurveyType.PLAINTEXT;
  numericOnly: boolean;
}

export interface SelectQuestion extends BaseQuestion {
  type: SurveyType.SELECT;
  options: string[];
  multiSelect: boolean;
}

export interface DropdownQuestion extends BaseQuestion {
  type: SurveyType.DROPDOWN;
  options: string[];
}

export interface AgreementQuestion extends BaseQuestion {
  type: SurveyType.AGREEMENT;
  personalInfoItems: string;
  purposeOfUse: string;
  retentionPeriod: string;
}

export interface Survey {
  _id: string;
  brand_id: number;
  title: string;
  description: string;
  created_at: string;
  questions: Question[];
}

export interface SurveyResponse {
  _id: string;
  surveyId: string;
  channelId: number;
  userId: number | null;
  submittedAt: string;
  registState: SurveyRegistState;
  answers: Array<{ questionId: string; answerValue: string }>;
}
