import { ACCEESS_TOKEN, serverUrl } from "configs";
import axiosInstance from "../axiosInstance";

export interface CreateBrandOutput {
  title: string;
  id: number;
  thumbnailImageUrl: string;
  description: string;
}

export const createBrand = async (): Promise<CreateBrandOutput> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);

  const result = await axiosInstance.post(`${serverUrl}/brands`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return result.data;
};
