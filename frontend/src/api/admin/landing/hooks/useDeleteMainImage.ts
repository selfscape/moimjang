import { ACCEESS_TOKEN, OWNER, serverUrl } from "configs";
import axiosInstance from "api/admin/axiosInstance";
import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";

export const fetchDeleteMainImage = async (): Promise<void> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);
  const owner = localStorage.getItem(OWNER);

  const result = await axiosInstance.delete(
    `${serverUrl}/landingAdmin/deleteImage/main`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        owner,
      },
    }
  );
  return result.data;
};

const useDeleteMainImage = () => {
  return useMutation<void, AxiosError, null>({
    mutationFn: fetchDeleteMainImage,
  });
};

export default useDeleteMainImage;
