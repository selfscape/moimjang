import { ACCEESS_TOKEN, serverUrl } from "configs";
import axiosInstance from "../axiosInstance";

export const getGroups = async () => {
  const token = localStorage.getItem(ACCEESS_TOKEN);

  const response = await axiosInstance.get(`${serverUrl}/groups`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
