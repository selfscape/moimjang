import { ACCEESS_TOKEN, serverUrl } from "configs";
import axiosInstance from "../../axiosInstance";

export const deleteCategory = async (
  question_card_category_id: number
): Promise<void> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);

  const result = await axiosInstance.delete(
    `${serverUrl}/questionCardCategoris/${question_card_category_id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return result.data;
};
