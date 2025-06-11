import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";

import {
  joinCategoryWithBrand,
  JoinCategoryWithBrandOutput,
} from "api/brand/joinCategoryWithBrand";

const useJoinCategoryWithBrand = () => {
  return useMutation<
    JoinCategoryWithBrandOutput,
    AxiosError,
    { brand_id: string; question_card_category_id: number }
  >({
    mutationFn: ({ brand_id, question_card_category_id }) =>
      joinCategoryWithBrand(brand_id, question_card_category_id),
  });
};

export default useJoinCategoryWithBrand;
