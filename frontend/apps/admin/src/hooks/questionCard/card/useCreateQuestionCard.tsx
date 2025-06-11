import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import {
  createQuestionCard,
  RequestBody,
} from "api/questionCard/card/createQuestionCard";
import { QuestionCard } from "interfaces/questionCardCategory";

const useCreateQuestionCard = () => {
  return useMutation<QuestionCard, AxiosError, RequestBody>({
    mutationFn: createQuestionCard,
  });
};

export default useCreateQuestionCard;
