import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { GET_BRAND_REVIEW_LIST } from "constants/admin/queryKeys";
import {
  getBrandReviewList,
  Output,
  Params,
} from "api/admin/brand/getBrandReviewList";

const useGetBrandReviewList = (params: Params) => {
  const { data, isLoading, error, isSuccess, refetch } = useQuery<
    Array<Output>,
    AxiosError,
    Array<Output>,
    [string, Params]
  >({
    queryKey: [GET_BRAND_REVIEW_LIST, params],
    queryFn: ({ queryKey }) => {
      return getBrandReviewList(queryKey[1]);
    },
    enabled: !!params.brandId,
  });

  return {
    data,
    refetch,
    isLoading,
    isSuccess,
    error,
  };
};

export default useGetBrandReviewList;
