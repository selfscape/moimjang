import { ACCEESS_TOKEN, OWNER, serverUrl } from "configs";
import axiosInstance from "api/axiosInstance";
import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { getCookie } from "hooks/auth/useOwnerCookie";

export const fetchDeleteMainImage = async (): Promise<void> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);
  const owner = getCookie(OWNER);

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
