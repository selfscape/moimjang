import { ACCEESS_TOKEN, serverUrl } from "configs";
import axiosInstance from "api/consumer/axiosInstance";

export interface GetQuestionCardsOutput {
  cardCategoryId: number;
  name: string;
  isCardVisible: boolean;
  id: number;
  image: {
    id: number;
    url: string;
  };
}

export const getQuestionCards = async (
  categoryId: string
): Promise<Array<GetQuestionCardsOutput>> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);

  const response = await axiosInstance.get(
    `${serverUrl}/customers/questionCards`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        categoryId,
      },
    }
  );
  return response.data;
};
