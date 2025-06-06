import { useQuery } from "@tanstack/react-query";
import { GET_BRAND_REVIEWS } from "@/constant/barnd/queryKey";
import { OWNER } from "@constants/auth";
import { BrandReview } from "@model/review";
import { serverUrl } from "@constants/config";
import useCookie from "@util/hooks/useCookie";

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
