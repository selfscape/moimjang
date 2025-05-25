import axios from "axios";
import { ACCEESS_TOKEN, serverUrl } from "configs";
import axiosInstance from "../axiosInstance";

export interface JoinChannelInput {
  userId: string;
  channelId: string;
}

export const joinChannel = async (userId: string, channelId: string) => {
  const token = localStorage.getItem(ACCEESS_TOKEN);

  try {
    const response = await axiosInstance.post(
      `${serverUrl}/users/${userId}/channel`,
      {
        target_channel_id: channelId, // 필수 필드인 channel_id를 본문에 추가
      },
      {
        headers: {
          user_id: Number(userId),
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
