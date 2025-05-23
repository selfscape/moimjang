import { useQuery } from "@tanstack/react-query";
import {
  getQuestionCards,
  GetQuestionCardsOutput,
} from "api/consumer/socialing/getQuestionCards";
import { GET_QUESTION_CATEGORIES } from "constants/admin/queryKeys";

const useGetQuestionCards = (categoryId: string) => {
  const { data, isLoading, error, isSuccess, refetch } = useQuery<
    Array<GetQuestionCardsOutput>,
    Error
  >({
    queryKey: [GET_QUESTION_CATEGORIES, categoryId],
    queryFn: () => getQuestionCards(categoryId),
    enabled: !!categoryId,
  });

  return {
    data,
    refetch,
    isLoading,
    isSuccess,
    error,
  };
};

export default useGetQuestionCards;
