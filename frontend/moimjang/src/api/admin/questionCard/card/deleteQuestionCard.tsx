import { ACCEESS_TOKEN, serverUrl } from "configs";
import axiosInstance from "../../axiosInstance";

export const deleteQuestionCard = async (
  question_card_id: number
): Promise<void> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);

  const result = await axiosInstance.delete(
    `${serverUrl}/questionCards/${question_card_id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return result.data;
};
