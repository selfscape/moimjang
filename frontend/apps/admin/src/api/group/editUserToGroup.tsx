import axios from "axios";
import { ACCEESS_TOKEN, serverUrl } from "configs";
import axiosInstance from "../axiosInstance";

export interface EditGroupToUserOutput {
  group_id: number;
  group_name: string;
  user_id: number;
  user_name: string;
}
export interface EditGroupToUserRequestBody {
  target_group_id: number;
}

const editGroupToUser = async (
  user_id: number,
  group_id: number,
  requestBody: EditGroupToUserRequestBody
): Promise<EditGroupToUserOutput> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);
  try {
    const response = await axiosInstance.put(
      `${serverUrl}/users/${user_id}/group/${group_id}`,
      requestBody,
      {
        headers: {
          user_id,
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

export default editGroupToUser;
