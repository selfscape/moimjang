import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ACCEESS_TOKEN, serverUrl, USER_NAME } from "configs";

import axiosInstance from "api/axiosInstance";

export const fetchDeleteGalleryImage = async (
  image_id: number
): Promise<void> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);
  const owner = localStorage.getItem(USER_NAME);

  const result = await axiosInstance.delete(
    `${serverUrl}/landingAdmin/deleteImage/gallery`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        owner,
      },
      params: {
        image_id,
      },
    }
  );
  return result.data;
};

const useDeleteGalleryImage = () => {
  return useMutation<void, AxiosError, number>({
    mutationFn: fetchDeleteGalleryImage,
  });
};

export default useDeleteGalleryImage;
