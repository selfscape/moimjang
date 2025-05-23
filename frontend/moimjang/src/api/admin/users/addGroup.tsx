import { ACCEESS_TOKEN, serverUrl } from "configs";
import axiosInstance from "../axiosInstance";

export interface AddGroupInput {
  group_id: number;
}

export interface AddGroupOutput {
  group_id: number;
  group_name: string;
  user_id: number;
  username: string;
}

export const addGroup = async (
  user_id: number,
  requestBody: AddGroupInput
): Promise<AddGroupOutput> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);

  const response = await axiosInstance.post(
    `${serverUrl}/users/${user_id}/group`,
    requestBody,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
