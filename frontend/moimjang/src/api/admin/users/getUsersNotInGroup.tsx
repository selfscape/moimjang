import axios from "axios";
import { ACCEESS_TOKEN, serverUrl } from "configs";
import axiosInstance from "../axiosInstance";

export const getUsersNotInGroup = async (channel_id: string) => {
  const token = localStorage.getItem(ACCEESS_TOKEN);

  try {
    const response = await axiosInstance.get(
      `${serverUrl}/users/channel/${channel_id}/non_group_users`,
      {
        headers: {
          channel_id,
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 422) {
      console.error("Validation Error:", error.response.data);
    } else {
      console.error("Error fetching user data:", error);
    }
    throw error;
  }
};
