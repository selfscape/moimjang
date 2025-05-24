import { ACCEESS_TOKEN, serverUrl } from "configs";
import axiosInstance from "api/consumer/axiosInstance";

import { User } from "interfaces/user";

export const getMyInfo = async (): Promise<User> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);

  const response = await axiosInstance.get(`${serverUrl}/customers/my_info`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
