import { ACCEESS_TOKEN, serverUrl } from "configs";
import axiosInstance from "api/consumer/axiosInstance";

export const joinChannel = async (target_channel_id: number) => {
  const token = localStorage.getItem(ACCEESS_TOKEN);

  const response = await axiosInstance.post(
    `${serverUrl}/customers/channel`,
    { target_channel_id }, // 요청 본문 데이터
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
