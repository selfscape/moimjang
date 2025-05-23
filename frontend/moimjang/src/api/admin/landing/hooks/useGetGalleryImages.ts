import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import axiosInstance from "api/admin/axiosInstance";
import { ACCEESS_TOKEN, OWNER, serverUrl } from "configs";
import { GET_GALLERY_IMAGES } from "constants/landing/queryKeys";

export const fetchGetGalleryImages = async (): Promise<
  Array<{ id: number; url: string }>
> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);
  const owner = localStorage.getItem(OWNER);

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
