import { useQuery } from "@tanstack/react-query";
import { USER_NAME } from "@constants/auth";
import { serverUrl } from "@/app/_constant/config";
import { GET_GALLERY_IMAGES } from "@/app/_constant/queryKeys";
import { Image } from "@model/common";
import useCookie from "@util/hooks/useCookie";

export const getMainImage = async (owner: string): Promise<Array<Image>> => {
  const result = await fetch(`${serverUrl}/landing/galleryImages`, {
    method: "GET",
    headers: {
      Owner: owner,
    },
    next: {
      tags: [GET_GALLERY_IMAGES],
    },
    cache: "no-store",
  });
  if (!result.ok) new Error("Failed to fetch data");

  return result.json();
};

const useGetGalleryImages = () => {
  const owner = useCookie(OWNER);

  return useQuery({
    queryKey: [GET_GALLERY_IMAGES, owner],
    queryFn: () => getMainImage(owner),
    staleTime: 60 * 1000,
    enabled: Boolean(owner),
  });
};

export default useGetGalleryImages;
