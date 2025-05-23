import { axiosInstance } from "..";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ACCEESS_TOKEN, OWNER, serverUrl } from "configs";

import { GET_GALLERY_IMAGES } from "constants/landing/queryKeys";

interface Output {
  id: number;
  url: string;
}

export const fetchGalleryImages = async (): Promise<Array<Output>> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);
  const owner = localStorage.getItem(OWNER);

  const response = await axiosInstance.get(
    `${serverUrl}/landing/galleryImages`,
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
  useQuery<Array<Output>, AxiosError>({
    queryKey: [GET_GALLERY_IMAGES],
    queryFn: () => fetchGalleryImages(),
  });

export default useGetGalleryImages;
