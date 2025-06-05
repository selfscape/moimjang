import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { deleteQuestionCard } from "api/questionCard/card/deleteQuestionCard";

const useDeleteQuestionCard = () => {
  return useMutation<void, AxiosError, number>({
    mutationFn: deleteQuestionCard,
  });
};

export default useDeleteQuestionCard;
