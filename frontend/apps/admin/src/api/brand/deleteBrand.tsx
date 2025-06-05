import { ACCEESS_TOKEN, serverUrl } from "configs";
import axiosInstance from "../axiosInstance";

export const deleteBrand = async (brand_id: string): Promise<void> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);

  const result = await axiosInstance.delete(`${serverUrl}/brands/${brand_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return result.data;
};
