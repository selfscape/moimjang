import axios from "axios";
import { ACCEESS_TOKEN, serverUrl } from "configs";
import axiosInstance from "../axiosInstance";

import { Group } from "interfaces/group";

export const getUserGroups = async (user_id: number): Promise<Array<Group>> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);

  const response = await axiosInstance.get(`${serverUrl}/${user_id}/groups`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
