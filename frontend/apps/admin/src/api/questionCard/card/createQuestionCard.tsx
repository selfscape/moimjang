import { ACCEESS_TOKEN, serverUrl } from "configs";
import { QuestionCard } from "interfaces/questionCardCategory";

import axiosInstance from "../../axiosInstance";

export interface RequestBody {
  cardCategoryId: number;
  name: string;
  isCardVisible: boolean;
}

export const createQuestionCard = async (
  requestBody: RequestBody
): Promise<QuestionCard> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);

  const result = await axiosInstance.post(
    `${serverUrl}/questionCards`,
    requestBody,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return result.data;
};
