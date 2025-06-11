import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";

import axiosInstance from "api/axiosInstance";
import { ACCEESS_TOKEN, serverUrl, USER_NAME } from "configs";

export const deleteBrandReview = async (review_id: number): Promise<void> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);
  const owner = localStorage.getItem(USER_NAME);

  const response = await axiosInstance.delete(
    `${serverUrl}/brandReviews/${review_id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        owner,
      },
    }
  );
  return response.data;
};

const useDeleteBrandReview = () =>
  useMutation<void, AxiosError, number>({
    mutationFn: deleteBrandReview,
  });

export default useDeleteBrandReview;
