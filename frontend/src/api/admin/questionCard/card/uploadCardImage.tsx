import { ACCEESS_TOKEN, serverUrl } from "configs";
import { QuestionCard } from "interfaces/questionCardCategory";

import axiosInstance from "../../axiosInstance";

export const uploadCardImage = async (
  file: File,
  card_id: number
): Promise<QuestionCard> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);

  const formData = new FormData();
  formData.append("file", file);

  const result = await axiosInstance.post(
    `${serverUrl}/questionCards/uploadImage`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      params: {
        card_id,
      },
    }
  );
  return result.data;
};
