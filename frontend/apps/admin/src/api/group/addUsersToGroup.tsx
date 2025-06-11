import axios from "axios";
import { ACCEESS_TOKEN, serverUrl } from "configs";
import axiosInstance from "../axiosInstance";

export interface AddUsersToGroupInput {
  user_id_list: Array<number>;
}

export interface AddUsersToGroupOutput {
  group_id: number;
  group_name: string;
  user_id: number;
  username: string;
}

export const addUsersToGroup = async (
  group_id: number,
  requestBody: AddUsersToGroupInput
): Promise<Array<AddUsersToGroupOutput>> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);

  try {
    const response = await axiosInstance.post(
      `${serverUrl}/groups/${group_id}/users`,
      requestBody,
      {
        headers: {
          group_id,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 422) {
      console.error("Validation Error:", error.response.data);
    } else {
      console.error("Error fetching user data:", error);
    }
    throw error;
  }
};
