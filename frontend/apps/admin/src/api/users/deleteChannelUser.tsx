import axios from "axios";
import { ACCEESS_TOKEN, serverUrl } from "configs";
import axiosInstance from "../axiosInstance";

export const deleteChannelUser = async (
  user_id: number,
  channel_id: string
): Promise<void> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);

  try {
    await axiosInstance.delete(
      `${serverUrl}/users/${user_id}/channel/${channel_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error deleting channelUser:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.detail?.map((d: any) => d.msg).join(", ") ||
          "Failed to delete channelUser"
      );
    } else {
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
};
