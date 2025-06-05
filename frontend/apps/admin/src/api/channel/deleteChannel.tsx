import axios from "axios";
import { ACCEESS_TOKEN, serverUrl } from "configs";
import axiosInstance from "../axiosInstance";

export const deleteChannel = async (channel_id: string): Promise<void> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);
  try {
    await axiosInstance.delete(`${serverUrl}/channels/${channel_id}`, {
      headers: {
        channel_id,
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error deleting channel:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.detail?.map((d: any) => d.msg).join(", ") ||
          "Failed to delete channel"
      );
    } else {
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
};
