import { useQuery } from "@tanstack/react-query";
import { GET_BRAND_REVIEWS } from "@/app/_constant/barnd/queryKey";
import { USER_NAME } from "@constants/auth";
import { BrandReview } from "@model/review";

import useCookie from "@util/hooks/useCookie";
import { serverUrl } from "@/app/_constant/config";

export interface Response {
  reviews: Array<BrandReview>;
  totalCount: number;
}

export const getBrandReviews = async (owner: string): Promise<Response> => {
  const result = await fetch(`${serverUrl}/landing/brandReviews`, {
    method: "GET",
    headers: {
      Owner: owner,
    },
    next: {
      tags: [GET_BRAND_REVIEWS],
    },
    cache: "no-store",
  });
  if (!result.ok) new Error("Failed to fetch data");

  return result.json();
};

const useGetBrandReviews = () => {
  const owner = useCookie(OWNER);

  return useQuery({
    queryKey: [GET_BRAND_REVIEWS, owner],
    queryFn: () => getBrandReviews(owner),
    staleTime: 60 * 1000,
    enabled: Boolean(owner),
  });
};

export default useGetBrandReviews;
