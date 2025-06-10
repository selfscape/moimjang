import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { GET_QUESTION_CATEGORIES } from "constants/queryKeys";

import { ACCEESS_TOKEN, OWNER, serverUrl } from "configs";
import { QuestionCardDeck } from "interfaces/questionCardCategory";
import axiosInstance from "api/axiosInstance";
import { getCookie } from "hooks/auth/useOwnerCookie";

export interface QuestionCategoriesOutput {
  id: number;
  title: string;
  description: string;
  thumbnailImage: {
    id: number;
    url: string;
  };
  allocatedQuestionCardDecList: Array<QuestionCardDeck>;
}

export const getQuestionCategories = async (
  brand_id: string
): Promise<QuestionCategoriesOutput> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);
  const owner = getCookie(OWNER);

  const response = await axiosInstance.get(
    `${serverUrl}/brands/${brand_id}/questionCardCategories/questionCards`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        owner,
      },
    }
  );

  return response.data;
};

const useGetQuestionCategories = (brand_id: string) => {
  const { data, isLoading, error, isSuccess } = useQuery<
    QuestionCategoriesOutput,
    AxiosError
  >({
    queryKey: [GET_QUESTION_CATEGORIES, brand_id],
    queryFn: () => getQuestionCategories(brand_id),
    enabled: !!brand_id,
  });

  return {
    data,
    isLoading,
    isSuccess,
    error,
  };
};

export default useGetQuestionCategories;
