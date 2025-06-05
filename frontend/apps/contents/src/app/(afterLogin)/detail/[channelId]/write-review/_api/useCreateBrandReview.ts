import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { BrandReview } from "@model/brand/review";
import { ACCEESS_TOKEN } from "@constants/auth";
import { serverUrl } from "@constants/config";

export interface requestBody {
  user_id: number | undefined;
  brand_id: string | null;
}

export const createBrandReview = async (
  body: requestBody,
  owner: string | null,
  token: string | null
): Promise<BrandReview> => {
  const res = await fetch(`${serverUrl}/customers/brandReviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token ?? ""}`,
      Owner: owner ?? "",
    },
    body: JSON.stringify(body),
    cache: "no-cache",
  });

  if (!res.ok) {
    throw new Error("Failed to create brand review");
  }
  return res.json();
};

const useCreateBrandReview = (owner: string | null) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem(ACCEESS_TOKEN));
  }, []);

  return useMutation<BrandReview, Error, { requestBody: requestBody }>({
    mutationFn: ({ requestBody }) =>
      createBrandReview(requestBody, owner, token),
  });
};

export default useCreateBrandReview;
