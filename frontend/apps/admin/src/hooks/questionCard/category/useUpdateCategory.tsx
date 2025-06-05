import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import {
  updateCategory,
  UpdateCategoryOutput,
} from "api/questionCard/category/updateCategory";

interface Variables {
  question_card_category_id: number;
  requestBody: {
    name: string;
    isDeckVisible: boolean;
  };
}

const useUpdateCategory = () => {
  return useMutation<UpdateCategoryOutput, AxiosError, Variables>({
    mutationFn: ({ question_card_category_id, requestBody }) =>
      updateCategory(question_card_category_id, requestBody),
  });
};

export default useUpdateCategory;
