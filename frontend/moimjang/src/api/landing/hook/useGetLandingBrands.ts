import { axiosInstance } from "..";
import { OWNER, serverUrl } from "configs";

import { LandingBrand } from "../type/landingBrand";
import { useQuery } from "@tanstack/react-query";
import { GET_LANDING_BRANDS } from "constants/landing/queryKeys";
import { BrandState } from "interfaces/brand";

export interface Params {
  state: BrandState;
  sort_by: string;
  descending: boolean;
  offset: number;
  limit: number;
}

export interface GetLandingBrandsOutput {
  brands: Array<LandingBrand>;
  totalCount: number;
}

export const getLandingBrands = async (
  params: Params
): Promise<GetLandingBrandsOutput> => {
  const owner = localStorage.getItem(OWNER);

  const response = await axiosInstance.get(`${serverUrl}/landing/brands`, {
    params,
    headers: {
      Owner: owner,
    },
  });

  return response.data;
};

const useGetLandingBrands = (params: Params) =>
  useQuery({
    queryKey: [GET_LANDING_BRANDS, params],
    queryFn: () => getLandingBrands(params),
  });

export default useGetLandingBrands;
