import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { BrandReview } from "@model/brand/review/index";
import { ACCEESS_TOKEN } from "@constants/auth";
import { serverUrl } from "@constants/config";

export const updateBrandReview = async (
  review_id: number,
  requestBody: {
    contents?: string;
    is_display?: boolean;
  },
  owner: string | null,
  token: string | null
): Promise<BrandReview> => {
  const res = await fetch(`${serverUrl}/brandReviews/${review_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token ?? ""}`,
      Owner: owner ?? "",
    },
    body: JSON.stringify(requestBody),
    cache: "no-cache",
  });

  if (!res.ok) {
    throw new Error("Failed to update brand review");
  }

  return res.json();
};

const useUpdateBrandReview = (owner: string | null) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem(ACCEESS_TOKEN);
    setToken(t);
  }, []);

  return useMutation<
    BrandReview,
    Error,
    {
      review_id: number;
      requestBody: {
        contents: string;
        is_display: boolean;
      };
    }
  >({
    mutationFn: ({ review_id, requestBody }) =>
      updateBrandReview(review_id, requestBody, owner, token),
  });
};

export default useUpdateBrandReview;
