import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { GET_QUESTION_CATEGORIES } from "@/app/_constant/queryKeys";
import { serverUrl } from "@/app/_constant/config";
import { ACCEESS_TOKEN } from "@constants/auth";

export interface Response {
  id: number;
  name: string;
  coverImage: { id: number; url: string };
  isDeckVisible: boolean;
}

export const getQuestionCardCategories = async (
  brandId: string | null,
  token: string | null,
  owner: string | null
): Promise<Array<Response>> => {
  const response = await fetch(
    `${serverUrl}/customers/questionCardCategories?brandId=${brandId}`,
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
    throw new Error("Failed to fetch question card categories");
  }

  return response.json();
};

const useGetQuestionCardCategories = (
  brandId: string | null,
  owner: string | null
) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem(ACCEESS_TOKEN));
  }, []);

  return useQuery<Array<Response>, Error>({
    queryKey: [GET_QUESTION_CATEGORIES, brandId, owner],
    queryFn: () => getQuestionCardCategories(brandId, token, owner),
    enabled: Boolean(brandId) && Boolean(token) && Boolean(owner),
  });
};

export default useGetQuestionCardCategories;
