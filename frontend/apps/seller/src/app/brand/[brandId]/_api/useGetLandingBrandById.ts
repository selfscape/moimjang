import { Brand } from "@model/brand";
import { useQuery } from "@tanstack/react-query";
import { GET_LANDING_BRAND_BY_ID } from "@/app/_constant/barnd/queryKey";
import { OWNER } from "@constants/auth";
import { serverUrl } from "@/app/_constant/config";
import useCookie from "@util/hooks/useCookie";

export const getLandingBrandById = async (
  brand_id: string,
  owner: string
): Promise<Brand> => {
  const result = await fetch(`${serverUrl}/landing/brands/${brand_id}`, {
    method: "GET",
    headers: {
      Owner: owner,
    },
    next: {
      tags: [GET_LANDING_BRAND_BY_ID],
    },
    cache: "no-store",
  });

  if (!result.ok) new Error("Failed to fetch data");

  return result.json();
};

const useGetLandingBrandById = (brand_id: string) => {
  const owner = useCookie(OWNER);

  return useQuery<Brand, Error>({
    queryKey: [GET_LANDING_BRAND_BY_ID, brand_id, owner],
    queryFn: () => getLandingBrandById(brand_id, owner),
    staleTime: 60 * 1000,
    enabled: Boolean(owner) && Boolean(brand_id),
  });
};

export default useGetLandingBrandById;
