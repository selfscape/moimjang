import { ACCEESS_TOKEN, serverUrl } from "configs";
import axiosInstance from "../../axiosInstance";

export interface UploadCoverImageOutput {
  id: number;
  name: string;
  isDeckVisible: boolean;
  coverImage: { id: number; url: string };
}

export const uploadCoverImage = async (
  file: File,
  question_card_category_id: number
): Promise<UploadCoverImageOutput> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);

  const formData = new FormData();
  formData.append("file", file);

  const result = await axiosInstance.post(
    `${serverUrl}/questionCardCategoris/${question_card_category_id}/uploadImage`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return result.data;
};
