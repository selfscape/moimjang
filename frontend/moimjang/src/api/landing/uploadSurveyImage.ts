import { serverUrl } from "configs";
import { axiosInstance } from ".";

export interface Output {
  imageUrl: string;
  imagePath: string;
}

export const uploadSurveyImage = async (file: File): Promise<Output> => {
  const formData = new FormData();
  formData.append("file", file);

  const result = await axiosInstance.post(
    `${serverUrl}/landing/surveys/form/uploadImage`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return result.data;
};
