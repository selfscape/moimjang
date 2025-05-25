// Interface to represent error response
export interface ErrorDetail {
  loc: [string, number]; // loc is an array, first element is a string (field name), second is an index (usually 0)
  msg: string; // Error message
  type: string; // Error type
}

export interface AllocatedQuestionCardDec {
  id?: number;
  name: string;
  isDeckVisible: boolean;
  coverImageUrl: string;
  questionCardList: Array<QuestionCardList>;
}

export interface QuestionCardList {
  id?: number;
  cardCategoryId?: number;
  name: string;
  imageUrl: string;
  isCardVisible: boolean;
}

export enum ButtonPlugin {
  GROUP = "GROUP",
}
