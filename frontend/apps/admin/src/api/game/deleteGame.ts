import axios from "axios";
import { ACCEESS_TOKEN, serverUrl } from "configs";
import axiosInstance from "../axiosInstance";

export const deleteGame = async (game_id: string): Promise<void> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);
  try {
    await axiosInstance.delete(`${serverUrl}/games/${game_id}`, {
      headers: {
        game_id,
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error deleting game:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.detail?.map((d: any) => d.msg).join(", ") ||
          "Failed to delete game"
      );
    } else {
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
};
