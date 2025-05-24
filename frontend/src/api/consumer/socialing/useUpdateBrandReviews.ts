import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { ACCEESS_TOKEN, OWNER, serverUrl } from "configs";
import axiosInstance from "api/admin/axiosInstance";
import { BrandReview } from "api/admin/brand/types/brandReview";

export interface UpdateBrandReviewVariables {
  review_id: number;
  requestBody: {
    contents: string;
    is_display: boolean;
  };
}

export const updateBrandReviews = async (
  review_id: number,
  requestBody: {
    contents: string;
    is_display: boolean;
  }
): Promise<BrandReview> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);
  const owner = localStorage.getItem(OWNER);

  const result = await axiosInstance.post(
    `${serverUrl}/customers/brandReviews/${review_id}`,
    requestBody,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        owner,
      },
    }
  );
  return result.data;
};

const useUpdateBrandReviews = () => {
  return useMutation<BrandReview, AxiosError, UpdateBrandReviewVariables>({
    mutationFn: ({ requestBody, review_id }) =>
      updateBrandReviews(review_id, requestBody),
  });
};

export default useUpdateBrandReviews;
