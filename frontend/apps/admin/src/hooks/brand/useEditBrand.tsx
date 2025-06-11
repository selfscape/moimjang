import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";

import { editBrand, EditBrandOutput, Input } from "api/brand/editBrand";

interface Variables {
  requestBody: Input;
  brand_id: string;
}

const useEditBrand = () =>
  useMutation<EditBrandOutput, AxiosError, Variables>({
    mutationFn: ({ requestBody, brand_id }) => editBrand(requestBody, brand_id),
  });

export default useEditBrand;
