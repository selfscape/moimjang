import { useQuery } from "@tanstack/react-query";
import { BrandReview } from "api/admin/brand/types/brandReview";
import { BRAND_REVIEWS } from "constants/admin/queryKeys";
import { ACCEESS_TOKEN, OWNER, serverUrl } from "configs";
import axios from "axios";

export interface GetBrandReviewsOutput {
  reviews: Array<BrandReview>;
  totalCount: number;
}

export const getBrandReviews = async (): Promise<GetBrandReviewsOutput> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);
  const owner = localStorage.getItem(OWNER);

  const response = await axios.get(`${serverUrl}/landing/brandReviews`, {
    headers: {
      Authorization: `Bearer ${token}`,
      owner,
    },
  });

  return response.data;
};

const useGetLandingBrandReviews = () =>
  useQuery({
    queryKey: [BRAND_REVIEWS],
    queryFn: getBrandReviews,
  });

export default useGetLandingBrandReviews;
