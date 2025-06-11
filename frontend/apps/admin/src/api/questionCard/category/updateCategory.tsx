import { ACCEESS_TOKEN, serverUrl } from "configs";
import axiosInstance from "../../axiosInstance";

export interface UpdateCategoryOutput {
  name: string;
  isDeckVisible: boolean;
  id: number;
  coverImageUrl: string;
}

export interface RequestBody {
  name: string;
  isDeckVisible: boolean;
}

export const updateCategory = async (
  question_card_category_id: number,
  requestBody: RequestBody
): Promise<UpdateCategoryOutput> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);

  const result = await axiosInstance.put(
    `${serverUrl}/questionCardCategoris/${question_card_category_id}`,
    requestBody,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return result.data;
};
