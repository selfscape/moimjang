import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { ACCEESS_TOKEN, OWNER, serverUrl } from "configs";
import axiosInstance from "api/axiosInstance";

export interface Output {
  id: number;
  url: string;
}

export const fetchUploadMainImage = async (file: File): Promise<Output> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);
  const owner = localStorage.getItem(OWNER);

  const formData = new FormData();
  formData.append("file", file);

  const result = await axiosInstance.put(
    `${serverUrl}/landingAdmin/uploadImage/main`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
        owner,
      },
    }
  );
  return result.data;
};

const useUploadMainImage = () => {
  return useMutation<Output, AxiosError, File>({
    mutationFn: fetchUploadMainImage,
  });
};

export default useUploadMainImage;
