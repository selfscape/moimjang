import { Brand, BrandState } from "@model/brand";
import { useQuery } from "@tanstack/react-query";
import { GET_BRANDS } from "@/app/_constant/barnd/queryKey";
import { OWNER } from "@constants/auth";
import { serverUrl } from "@/app/_constant/config";
import useCookie from "@util/hooks/useCookie";

export interface Params {
  state: BrandState;
  sort_by: string;
  descending: boolean;
  offset: number;
  limit: number;
}

export interface Response {
  brands: Array<Brand>;
  totalCount: number;
}

export const getLandingBrands = async (
  params: Params,
  owner: string
): Promise<Response> => {
  const queryString = new URLSearchParams({
    state: params.state,
    sort_by: params.sort_by,
    descending: params.descending.toString(),
    offset: params.offset.toString(),
    limit: params.limit.toString(),
  }).toString();

  const result = await fetch(`${serverUrl}/landing/brands?${queryString}`, {
    method: "GET",
    headers: {
      Owner: owner,
    },
    next: {
      tags: [GET_BRANDS],
    },
    cache: "no-store",
  });
  if (!result.ok) new Error("Failed to fetch data");

  return result.json();
};

const useGetLandingBrands = (params: Params) => {
  const owner = useCookie(OWNER);

  return useQuery({
    queryKey: [GET_BRANDS, params, owner],
    queryFn: () => getLandingBrands(params, owner),
    staleTime: 60 * 1000,
    enabled: Boolean(owner),
  });
};

export default useGetLandingBrands;
