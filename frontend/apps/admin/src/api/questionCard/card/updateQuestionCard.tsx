import { ACCEESS_TOKEN, serverUrl } from "configs";
import axiosInstance from "../../axiosInstance";
import { QuestionCard } from "interfaces/questionCardCategory";

export interface RequestBody {
  cardCategoryId: number;
  name: string;
  isCardVisible: boolean;
}

export const updateQuestionCard = async (
  card_id: number,
  requestBody: RequestBody
): Promise<QuestionCard> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);

  const result = await axiosInstance.put(
    `${serverUrl}/questionCards/${card_id}`,
    requestBody,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return result.data;
};
