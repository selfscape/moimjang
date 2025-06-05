import { ACCEESS_TOKEN, serverUrl } from "configs";
import axiosInstance from "../axiosInstance";

export const uploadDetailImage = async (
  file: File,
  brand_id: string
): Promise<{
  id: number;
  url: string;
}> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("brand_id", brand_id);

  const result = await axiosInstance.post(
    `${serverUrl}/brands/uploadImage/detail`,
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
