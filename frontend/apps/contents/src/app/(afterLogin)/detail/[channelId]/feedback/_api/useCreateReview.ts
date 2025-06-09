import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { serverUrl } from "@/app/_constant/config";
import { ACCEESS_TOKEN } from "@constants/auth";

export interface RequestBody {
  target_user_id: number | null;
  reviewer_user_id: number | null;
  channel_id: number;
  style: string;
  impression: string;
  conversation: string;
  additional_info: string;
  keywords: string;
  is_reviewer_anonymous: boolean;
}

export const createReview = async (
  requestBody: RequestBody,
  owner: string,
  token: string | null
) => {
  const response = await fetch(`${serverUrl}/customers/review`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      Owner: owner,
    },
    body: JSON.stringify(requestBody),
    cache: "no-cache",
  });

  if (!response.ok) {
    throw new Error("Failed to regist form");
  }

  const result = await response.json();

  return result;
};

const useCreateReview = (owner: string) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem(ACCEESS_TOKEN);
    setToken(token);
  }, []);

  return useMutation<
    Response,
    Error,
    {
      requestBody: RequestBody;
    }
  >({
    mutationFn: ({ requestBody }) => createReview(requestBody, owner, token),
  });
};

export default useCreateReview;
