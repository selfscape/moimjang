import { useQuery } from "@tanstack/react-query";
import { GET_QUESTION_CATEGORIES } from "constants/queryKeys";
import { ACCEESS_TOKEN, OWNER, serverUrl } from "configs";
import axiosInstance from "api/axiosInstance";

export interface GetQuestionCardCategoriesOutput {
  id: number;
  name: string;
  coverImage: { id: number; url: string };
  isDeckVisible: boolean;
}

export const getQuestionCardCategories = async (
  brandId: number
): Promise<Array<GetQuestionCardCategoriesOutput>> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);
  const owner = localStorage.getItem(OWNER);

  const response = await axiosInstance.get(
    `${serverUrl}/customers/questionCardCategories`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        owner,
      },
      params: {
        brandId,
      },
    }
  );
  return response.data;
};

const useGetQuestionCardCategories = (brand_id?: number) => {
  const { data, isLoading, error, isSuccess, refetch } = useQuery<
    Array<GetQuestionCardCategoriesOutput>,
    Error
  >({
    queryKey: [GET_QUESTION_CATEGORIES, brand_id],
    queryFn: () => getQuestionCardCategories(brand_id),
    enabled: !!brand_id,
  });

  return {
    data,
    refetch,
    isLoading,
    isSuccess,
    error,
  };
};

export default useGetQuestionCardCategories;
