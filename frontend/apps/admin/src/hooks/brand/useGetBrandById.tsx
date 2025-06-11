import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { AxiosError } from "axios";

import { getBrandById } from "api/brand/getBrandById";
import { GET_BRAND_BY_ID } from "constants/queryKeys";
import { Brand } from "interfaces/brand";

const useGetBrandById = (brandId: string) => {
  const { data, isLoading, error, isSuccess, refetch } = useQuery<
    Brand,
    AxiosError
  >({
    queryKey: [GET_BRAND_BY_ID, brandId],
    queryFn: () => getBrandById(brandId),
    enabled: !!brandId,
  });

  return {
    data,
    isLoading,
    isSuccess,
    refetch,
    error,
  };
};

export default useGetBrandById;
