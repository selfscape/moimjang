import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";

import { deleteCategory } from "api/questionCard/category/deleteCategory";

const useDeleteCategory = () => {
  return useMutation<void, AxiosError, number>({
    mutationFn: (question_card_category_id) =>
      deleteCategory(question_card_category_id),
  });
};

export default useDeleteCategory;
