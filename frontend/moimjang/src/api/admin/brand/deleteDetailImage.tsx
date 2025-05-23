import { ACCEESS_TOKEN, serverUrl } from "configs";
import { QuestionCard } from "interfaces/questionCardCategory";
import axiosInstance from "../axiosInstance";

export const deleteDetailImage = async (
  image_id: number,
  brand_id: number
): Promise<QuestionCard> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);

  const result = await axiosInstance.delete(
    `${serverUrl}/brands/uploadImages/detail`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      params: {
        brand_id,
        image_id,
      },
    }
  );
  return result.data;
};
