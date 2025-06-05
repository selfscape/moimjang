import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import axiosInstance from "api/axiosInstance";
import { GET_BRANDS } from "constants/queryKeys";
import { ACCEESS_TOKEN, OWNER, serverUrl } from "configs";
import { Brand, BrandState } from "interfaces/brand";

export interface GetBrandOutput {
  brands: Array<Brand>;
  totalCount: number;
}

export interface GetBrandParams {
  state: BrandState;
  sort_by: string;
  descending: boolean;
  offset: number;
  limit: number;
}

export const getBrands = async (
  params: GetBrandParams
): Promise<GetBrandOutput> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);
  const owner = localStorage.getItem(OWNER);

  const response = await axiosInstance.get(`${serverUrl}/brands`, {
    headers: {
      Authorization: `Bearer ${token}`,
      owner,
    },
    params,
  });

  return response.data;
};

const useGetBrands = (params: GetBrandParams) =>
  useQuery<GetBrandOutput, AxiosError>({
    queryKey: [GET_BRANDS, params],
    queryFn: () => getBrands(params),
  });

export default useGetBrands;
