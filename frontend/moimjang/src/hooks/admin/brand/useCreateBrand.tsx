import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { ACCEESS_TOKEN, serverUrl } from "configs";
import axiosInstance from "api/admin/axiosInstance";

export interface CreateBrandOutput {
  title: string;
  id: number;
  thumbnailImageUrl: string;
  description: string;
}

export const createBrand = async (): Promise<CreateBrandOutput> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);

  const result = await axiosInstance.post(
    `${serverUrl}/brands`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return result.data;
};

const useCreateBrand = () => {
  return useMutation<CreateBrandOutput, AxiosError, Object>({
    mutationFn: createBrand,
  });
};

export default useCreateBrand;
