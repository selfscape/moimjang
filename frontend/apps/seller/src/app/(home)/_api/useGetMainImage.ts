import { useQuery } from "@tanstack/react-query";
import { OWNER } from "@constants/auth";
import { GET_MAIN_IMAGE } from "@/constant/queryKeys";
import { Image } from "@model/common";
import { serverUrl } from "@constants/config";
import useCookie from "@util/hooks/useCookie";

export const getMainImage = async (owner: string): Promise<Image> => {
  const result = await fetch(`${serverUrl}/landing/mainImage`, {
    method: "GET",
    headers: {
      Owner: owner,
    },
    next: {
      tags: [GET_MAIN_IMAGE],
    },
    cache: "no-store",
  });

  if (!result.ok) new Error("Failed to fetch data");

  return result.json();
};

const useGetMainImage = () => {
  const owner = useCookie(OWNER);

  return useQuery({
    queryKey: [GET_MAIN_IMAGE, owner],
    queryFn: () => getMainImage(owner),
    staleTime: 60 * 1000,
    enabled: Boolean(owner),
  });
};

export default useGetMainImage;
