import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";

import axiosInstance from "api/axiosInstance";
import { ACCEESS_TOKEN, OWNER, serverUrl } from "configs";
import { BrandReview } from "../types/brandReview";

export interface Params {
  review_id: number;
  requestBody: {
    contents?: string;
    is_display?: boolean;
  };
}

export const updateBrandReview = async (
  param: Params
): Promise<BrandReview> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);
  const owner = localStorage.getItem(OWNER);

  const response = await axiosInstance.put<BrandReview>(
    `${serverUrl}/brandReviews/${param.review_id}`,
    param.requestBody,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        owner,
      },
    }
  );
  return response.data;
};

const useUpdateBrandReview = () =>
  useMutation<BrandReview, AxiosError, Params>({
    mutationFn: updateBrandReview,
  });

export default useUpdateBrandReview;
