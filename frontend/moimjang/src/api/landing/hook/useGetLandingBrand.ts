import { axiosInstance } from "..";
import { useQuery } from "@tanstack/react-query";
import { serverUrl } from "configs";

import { LandingBrand } from "../type/landingBrand";
import { GET_LANDING_BRAND } from "constants/landing/queryKeys";

export const fetchLandingBrand = async (
  brand_id: string
): Promise<LandingBrand> => {
  const response = await axiosInstance.get(
    `${serverUrl}/landing/brands/${brand_id}`
  );

  return response.data;
};

const useGetLandingBrand = (brandId: string) =>
  useQuery({
    queryKey: [GET_LANDING_BRAND],
    queryFn: () => fetchLandingBrand(brandId),
    enabled: !!brandId,
  });

export default useGetLandingBrand;
