import axios from "axios";
import { ACCEESS_TOKEN, serverUrl } from "configs";
import axiosInstance from "../axiosInstance";

export const deleteGroup = async (group_id: number): Promise<void> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);

  try {
    const response = await axiosInstance.delete(
      `${serverUrl}/groups/${group_id}`,
      {
        headers: {
          group_id,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error deleting group:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.detail?.map((d: any) => d.msg).join(", ") ||
          "Failed to delete group"
      );
    } else {
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
};
