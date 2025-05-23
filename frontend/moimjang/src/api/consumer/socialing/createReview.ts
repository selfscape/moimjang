import { ACCEESS_TOKEN, serverUrl } from "configs";
import axiosInstance from "api/consumer/axiosInstance";

export interface CreateReviewRequestBody {
  target_user_id: number;
  reviewer_user_id: number;
  channel_id: number;
  style: string;
  impression: string;
  conversation: string;
  additional_info: string;
}

export const createReview = async (requestBody: CreateReviewRequestBody) => {
  const token = localStorage.getItem(ACCEESS_TOKEN);

  const response = await axiosInstance.post(
    `${serverUrl}/customers/review`,
    requestBody,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
