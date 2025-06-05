import { useQuery } from "@tanstack/react-query";
import { BrandReview } from "../types/brandReview";
import { BRAND_REVIEWS } from "constants/queryKeys";
import { ACCEESS_TOKEN, OWNER, serverUrl } from "configs";
import axios from "axios";

export interface GetBrandReviewsOutput {
  reviews: Array<BrandReview>;
  totalCount: number;
}

export interface GetBrandReviewsParams {
  offset: number;
  limit: number;
  sort_by: string;
  descending: boolean;
}

export const getBrandReviews = async (
  params: GetBrandReviewsParams
): Promise<GetBrandReviewsOutput> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);
  const owner = localStorage.getItem(OWNER);

  const response = await axios.get(`${serverUrl}/brandReviews`, {
    headers: {
      Authorization: `Bearer ${token}`,
      owner,
    },
    params,
  });

  return response.data;
};

const useGetBrandReviews = (params: GetBrandReviewsParams) =>
  useQuery({
    queryKey: [BRAND_REVIEWS, params],
    queryFn: () => getBrandReviews(params),
  });

export default useGetBrandReviews;
