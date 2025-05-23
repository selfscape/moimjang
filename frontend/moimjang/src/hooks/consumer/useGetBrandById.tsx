import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import {
  getBrandById,
  GetBrandByIdOutput,
} from "api/consumer/socialing/getBrandById";
import { GET_CHANNELS_BY_ID } from "constants/consumer/queryKeys";

const useGetBrandById = (brand_id: number) => {
  const { data, isLoading, error, isSuccess, refetch } = useQuery<
    GetBrandByIdOutput,
    AxiosError
  >({
    queryKey: [GET_CHANNELS_BY_ID, brand_id],
    queryFn: () => getBrandById(brand_id),
    enabled: !!brand_id,
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
