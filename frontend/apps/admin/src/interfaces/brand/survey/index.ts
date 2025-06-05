export enum SurveyType {
  SELECT = "SELECT",
  PLAINTEXT = "PLAINTEXT",
  DROPDOWN = "DROPDOWN",
  IMAGE = "IMAGE",
  AGREEMENT = "AGREEMENT",
}

export interface BaseQuestion {
  id: string;
  type: SurveyType;
  text: string;
  description: string;
  isRequired: boolean;
}

export interface SelectQuestion extends BaseQuestion {
  options: string[];
  multiSelect: boolean;
}

export interface DropdownQuestion extends BaseQuestion {
  options: string[];
}

export interface PlaintextQuestion extends BaseQuestion {
  numericOnly: boolean;
}

export interface AgreementQuestion extends BaseQuestion {
  personalInfoItems: string;
  purposeOfUse: string;
  retentionPeriod: string;
}

export type Question = SelectQuestion | PlaintextQuestion | AgreementQuestion;

export interface Survey {
  _id: string;
  brand_id: number;
  title: string;
  description: string;
  created_at: string;
  questions: Question[];
}
