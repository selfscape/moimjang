export interface QuestionCard {
  id: number;
  cardCategoryId: number;
  name: string;
  isCardVisible: boolean;
  image: {
    id: number;
    url: string;
  };
}

export interface QuestionCardDeck {
  id: number;
  name: string;
  isDeckVisible: boolean;
  coverImage: {
    id: number;
    url: string;
  };
  questionCardList: QuestionCard[];
}
