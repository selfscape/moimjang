import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";

import {
  createCategory,
  CreateCategoryOutput,
  ReqeustBody,
} from "api/admin/questionCard/category/createCategory";

const useCreateCategory = () => {
  return useMutation<CreateCategoryOutput, AxiosError, ReqeustBody>({
    mutationFn: (requestBody) => createCategory(requestBody),
  });
};

export default useCreateCategory;
