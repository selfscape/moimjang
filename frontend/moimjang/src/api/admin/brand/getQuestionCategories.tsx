import { ACCEESS_TOKEN, serverUrl } from "configs";
import { QuestionCardDeck } from "interfaces/questionCardCategory";
import axiosInstance from "../axiosInstance";

export interface QuestionCategoriesOutput {
  id: number;
  title: string;
  description: string;
  thumbnailImage: {
    id: number;
    url: string;
  };
  allocatedQuestionCardDecList: Array<QuestionCardDeck>;
}

export const getQuestionCategories = async (
  brand_id: string
): Promise<QuestionCategoriesOutput> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);
  const response = await axiosInstance.get(
    `${serverUrl}/brands/${brand_id}/questionCardCategories/questionCards`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
