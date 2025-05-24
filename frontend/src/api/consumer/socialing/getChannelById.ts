import { ACCEESS_TOKEN, serverUrl } from "configs";
import axiosInstance from "api/consumer/axiosInstance";

export const getChannelById = async (channel_id: string) => {
  const token = localStorage.getItem(ACCEESS_TOKEN);

  const response = await axiosInstance.get(
    `${serverUrl}/customers/channel/${channel_id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
