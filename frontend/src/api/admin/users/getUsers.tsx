import axios from "axios";
import { ACCEESS_TOKEN, serverUrl } from "configs";
import axiosInstance from "../axiosInstance";
import { User } from "interfaces/user";

export interface GetUsersOutput {
  users: Array<User>;
  totalCount: number;
}

export const getUsers = async (
  offset = 0,
  limit = 20,
  descending = false
): Promise<GetUsersOutput> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);

  const response = await axiosInstance.get(`${serverUrl}/users`, {
    params: { offset, limit, descending },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
