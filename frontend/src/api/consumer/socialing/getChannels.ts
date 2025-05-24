import axios from "axios";
import { ACCEESS_TOKEN, serverUrl } from "configs";
import axiosInstance from "api/consumer/axiosInstance";

export interface GetChannelsOutput {
  channel_id: number;
  channel_name: string;
  user_id: number;
  user_name: string;
}

export const getChannels = async (): Promise<Array<GetChannelsOutput>> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);

  const response = await axiosInstance.get(`${serverUrl}/customers/channels`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
