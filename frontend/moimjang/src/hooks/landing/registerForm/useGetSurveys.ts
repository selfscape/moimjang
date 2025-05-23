import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import { getSurveys } from "api/landing/getSurveys";
import { GET_SURVEYS } from "constants/landing/queryKeys";
import { Survey } from "interfaces/landing";

const useGetSurveys = (brand_id: number) => {
  const { data, isLoading, error, isSuccess, refetch } = useQuery<
    Array<Survey>,
    AxiosError
  >({
    queryKey: [GET_SURVEYS, brand_id],
    queryFn: () => getSurveys(brand_id),
    enabled: !!brand_id,
  });

  return {
    data,
    refetch,
    isLoading,
    isSuccess,
    error,
  };
};

export default useGetSurveys;
