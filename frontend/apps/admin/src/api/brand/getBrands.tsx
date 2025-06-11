import { ACCEESS_TOKEN, serverUrl } from "configs";
import axiosInstance from "../axiosInstance";

export const getBrands = async () => {
  const token = localStorage.getItem(ACCEESS_TOKEN);
  const response = await axiosInstance.get(`${serverUrl}/brands`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
