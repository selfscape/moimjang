import { ACCEESS_TOKEN, serverUrl } from "configs";
import axiosInstance from "api/admin/axiosInstance";
import { Channel, ChannelState } from "../type/channel";

export const updateChannelState = async ({
  channel_id,
  channel_state,
}: {
  channel_id: number;
  channel_state: ChannelState;
}): Promise<Channel> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);

  const result = await axiosInstance.put(
    `${serverUrl}/channels/${channel_id}/state`,
    { channel_state },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return result.data;
};
