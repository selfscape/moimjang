import { ACCEESS_TOKEN, serverUrl } from "configs";
import axiosInstance from "../axiosInstance";
import { ChannelFeatureButton } from "constants/common";

export interface EditChannelInput {
  title: string;
  brand_id: number;
  description: string;
  event_date: string;
  visible_components: string[];
}

export const editChannel = async (
  channel_id: string,
  channelData: EditChannelInput
): Promise<void> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);

  await axiosInstance.put(`${serverUrl}/channels/${channel_id}`, channelData, {
    headers: {
      channel_id,
      Authorization: `Bearer ${token}`,
    },
  });
};
