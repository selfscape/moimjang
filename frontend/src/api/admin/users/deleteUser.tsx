import axios from "axios";
import axiosInstance from "../axiosInstance";
import { ACCEESS_TOKEN, serverUrl } from "configs";

export const deleteUser = async (user_id: string): Promise<void> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);
  try {
    await axiosInstance.delete(`${serverUrl}/users/${user_id}`, {
      headers: {
        user_id,
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error deleting user:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.detail?.map((d: any) => d.msg).join(", ") ||
          "Failed to delete user"
      );
    } else {
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
};
