import { ACCEESS_TOKEN, serverUrl } from "configs";
import axiosInstance from "api/admin/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface Output {
  id: number;
  url: string;
}

export const fetchUpdateMainImage = async (file: File): Promise<Output> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);

  const formData = new FormData();
  formData.append("file", file);

  const result = await axiosInstance.put(
    `${serverUrl}/landingAdmin/uploadImage/main`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return result.data;
};

const useFetchUpdateMainImage = () => {
  return useMutation<Output, AxiosError, File>({
    mutationFn: fetchUpdateMainImage,
  });
};

export default useFetchUpdateMainImage;
