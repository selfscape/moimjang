import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "api/axiosInstance";
import { ACCEESS_TOKEN, serverUrl, USER_NAME } from "configs";

interface Output {
  id: number;
  url: string;
}

export const fetchUploadGalleryImage = async (file: File): Promise<Output> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);
  const owner = localStorage.getItem(USER_NAME);

  const formData = new FormData();
  formData.append("file", file);

  const result = await axiosInstance.post(
    `${serverUrl}/landingAdmin/uploadImage/gallery`,
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

const useUploadGalleryImage = () => {
  return useMutation<Output, AxiosError, File>({
    mutationFn: fetchUploadGalleryImage,
  });
};

export default useUploadGalleryImage;
