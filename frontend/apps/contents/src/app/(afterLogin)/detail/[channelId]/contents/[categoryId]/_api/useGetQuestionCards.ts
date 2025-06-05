import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { GET_QUESTION_CATEGORIES } from "@/app/_constant/queryKeys";
import { ACCEESS_TOKEN } from "@constants/auth";
import { serverUrl } from "@constants/config";

export interface GetQuestionCardsOutput {
  cardCategoryId: number;
  name: string;
  isCardVisible: boolean;
  id: number;
  image: {
    id: number;
    url: string;
  };
}

export const getQuestionCards = async (
  categoryId: string | string[] | undefined,
  token: string | null,
  owner: string | null
): Promise<Array<GetQuestionCardsOutput>> => {
  const response = await fetch(
    `${serverUrl}/customers/questionCards?categoryId=${categoryId}`,
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
    throw new Error("Failed to fetch question cards");
  }
  return response.json();
};

const useGetQuestionCards = (
  categoryId: string | string[] | undefined,
  owner: string
) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem(ACCEESS_TOKEN));
  }, []);

  return useQuery<Array<GetQuestionCardsOutput>, Error>({
    queryKey: [GET_QUESTION_CATEGORIES, categoryId, owner],
    queryFn: () => getQuestionCards(categoryId, token, owner),
    enabled: Boolean(categoryId) && Boolean(token) && Boolean(owner),
  });
};

export default useGetQuestionCards;
