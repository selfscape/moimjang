import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { serverUrl } from "@/app/_constant/config";
import { ACCEESS_TOKEN } from "@constants/auth";
import { Review } from "@model/channel/review";
import { GET_REVIEW_LIST } from "@/app/_constant/queryKeys";

export const getReviewList = async (
  channelId: string | string[] | undefined,
  token: string | null,
  owner: string | null
): Promise<Review[]> => {
  const response = await fetch(
    `${serverUrl}/customers/reviews?channel_id=${channelId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Owner: owner || "",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch reviews");
  }

  return response.json();
};

const useGetReviewList = (
  channelId: string | string[] | undefined,
  owner: string | null
) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem(ACCEESS_TOKEN));
  }, []);

  return useQuery<Array<Review>, Error>({
    queryKey: [GET_REVIEW_LIST, channelId, owner],
    queryFn: () => getReviewList(channelId, token, owner),
    enabled: Boolean(channelId) && Boolean(token) && Boolean(owner),
  });
};

export default useGetReviewList;
