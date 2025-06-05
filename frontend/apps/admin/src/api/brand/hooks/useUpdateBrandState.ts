import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "api/axiosInstance";
import { ACCEESS_TOKEN, serverUrl } from "configs";
import { Brand, BrandState } from "interfaces/brand";

interface Variables {
  brand_id: number;
  brand_state: BrandState;
}

export const updateBrandState = async ({
  brand_id,
  brand_state,
}: {
  brand_id: number;
  brand_state: BrandState;
}): Promise<Brand> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);

  const result = await axiosInstance.put(
    `${serverUrl}/brands/${brand_id}/state`,
    { brand_state },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return result.data;
};

const useUpdateBrandState = () => {
  return useMutation<Brand, AxiosError, Variables>({
    mutationFn: updateBrandState,
  });
};

export default useUpdateBrandState;
