import { ACCEESS_TOKEN, serverUrl } from "configs";

import { Review } from "interfaces/channels";
import axiosInstance from "api/consumer/axiosInstance";

export const getReviewList = async (
  channel_id: string
): Promise<Array<Review>> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);
  const response = await axiosInstance.get(
    `${serverUrl}/customers/reviews?channel_id=${channel_id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        channel_id,
      },
    }
  );

  return response.data;
};
