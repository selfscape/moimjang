import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { deleteBrand } from "api/admin/brand/deleteBrand";

const useDeleteBrand = () => {
  return useMutation<void, AxiosError, string>({
    mutationFn: deleteBrand,
  });
};

export default useDeleteBrand;
