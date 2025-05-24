import { ACCEESS_TOKEN, serverUrl } from "configs";
import axiosInstance from "api/consumer/axiosInstance";

export interface getChannelJoinedUsersOutput {
  channel_id: number;
  channel_name: string;
  user_id: number;
  user_name: string;
  user_gender: string;
}

export const getChannelJoinedUsers = async (
  channel_id: string
): Promise<Array<getChannelJoinedUsersOutput>> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);

  const response = await axiosInstance.get(
    `${serverUrl}/customers/channel/${channel_id}/joined_users`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
