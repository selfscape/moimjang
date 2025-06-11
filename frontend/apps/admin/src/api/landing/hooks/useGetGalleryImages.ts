import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import axiosInstance from "api/axiosInstance";
import { ACCEESS_TOKEN, serverUrl, USER_NAME } from "configs";
import { GET_GALLERY_IMAGES } from "constants/queryKeys";

export const fetchGetGalleryImages = async (): Promise<
  Array<{ id: number; url: string }>
> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);
  const owner = localStorage.getItem(USER_NAME);

  const response = await axiosInstance.get(
    `${serverUrl}/landingAdmin/galleryImages`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        owner,
      },
    }
  );
  return response.data;
};

const useGetGalleryImages = () =>
  useQuery<Array<{ id: number; url: string }>, AxiosError>({
    queryKey: [GET_GALLERY_IMAGES],
    queryFn: fetchGetGalleryImages,
  });

export default useGetGalleryImages;
