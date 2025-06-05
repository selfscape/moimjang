import { ACCEESS_TOKEN, serverUrl } from "configs";
import axiosInstance from "../axiosInstance";
import { ChannelFeatureButton } from "constants/common";

export interface CreateChannelInput {
  title: string; // 채널 제목
  brand_id: number; // 브랜드 ID
  description: string; // 설명
  event_date: string;
  min_participants?: number; // 최소 인원
  max_participants?: number; // 최대 인원
  meeting_location?: string; // 모임 장소
  location_link?: string; // 장소 링크(URL)
  visible_components?: string[];
}

export const createChannel = async (
  channelData: CreateChannelInput
): Promise<void> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);

  await axiosInstance.post(`${serverUrl}/channels`, channelData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
