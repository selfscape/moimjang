import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";

import axiosInstance from "api/axiosInstance";
import { ACCEESS_TOKEN, serverUrl, USER_NAME } from "configs";
import { BrandReview } from "../types/brandReview";

export interface CreateBrandReviewInput {
  user_id: number;
  brand_id: number;
}

export const createBrandReview = async (
  requestBody: CreateBrandReviewInput
): Promise<BrandReview> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);
  const owner = localStorage.getItem(USER_NAME);

  const result = await axiosInstance.post(
    `${serverUrl}/customers/brandReviews`,
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

const useCreateBrandReview = () =>
  useMutation<BrandReview, AxiosError, CreateBrandReviewInput>({
    mutationFn: createBrandReview,
  });

export default useCreateBrandReview;
