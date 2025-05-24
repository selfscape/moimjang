import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import {
  updateQuestionCard,
  RequestBody,
} from "api/admin/questionCard/card/updateQuestionCard";
import { QuestionCard } from "interfaces/questionCardCategory";

interface Variables {
  card_id: number;
  requestBody: RequestBody;
}

const useUpdateQuestionCard = () => {
  return useMutation<QuestionCard, AxiosError, Variables>({
    mutationFn: ({ card_id, requestBody }) =>
      updateQuestionCard(card_id, requestBody),
  });
};

export default useUpdateQuestionCard;
