import axios from "axios";
import { ACCEESS_TOKEN, serverUrl } from "configs";
import { Group } from "interfaces/group";
import axiosInstance from "../axiosInstance";

export interface CreateGroupInput {
  channel_id: number;
  group_name: string;
}

export const createGroup = async (
  requestBody: CreateGroupInput
): Promise<Group> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);

  const response = await axiosInstance.post(
    `${serverUrl}/groups`,
    requestBody,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
