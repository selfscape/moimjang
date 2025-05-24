import { ACCEESS_TOKEN, serverUrl } from "configs";
import axiosInstance from "../axiosInstance";

export interface Output {
  imageUrl: string;
  imagePath: string;
}

export const uploadBrandReviewImage = async (
  file: File,
  brand_review_id: number
): Promise<Output> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("brand_review_id", String(brand_review_id));

  const token = localStorage.getItem(ACCEESS_TOKEN);

  const result = await axiosInstance.post(
    `${serverUrl}/customers/brandReviews/uploadImage`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return result.data;
};
