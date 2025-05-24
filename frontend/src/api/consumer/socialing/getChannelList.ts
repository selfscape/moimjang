import { ACCEESS_TOKEN, serverUrl } from "configs";
import axiosInstance from "api/consumer/axiosInstance";
import { Channel, ChannelState } from "api/admin/channel/type/channel";

export interface Params {
  state?: ChannelState;
  sort_by?: string;
  descending?: boolean;
}

export const getChannelList = async (
  params: Params
): Promise<Array<Channel>> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);
  const response = await axiosInstance.get(
    `${serverUrl}/customers/channel_list`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    }
  );

  return response.data;
};
