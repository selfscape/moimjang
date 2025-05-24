import axios from "axios";
import { ACCEESS_TOKEN, serverUrl } from "configs";
import axiosInstance from "../axiosInstance";

export interface EditGroupInput {
  channel_id: number;
  group_name: string;
}

export interface EditGroupOutput {
  id: number;
  channel_id: number;
  group_name: string;
  created_at: string; // ISO 8601 날짜 문자열
}

export const editGroup = async (
  group_id: number,
  requestBody: EditGroupInput
): Promise<EditGroupOutput> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);

  try {
    const response = await axiosInstance.put(
      `${serverUrl}/groups/${group_id}`,
      requestBody,
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
        "Error editing group:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.detail?.map((d: any) => d.msg).join(", ") ||
          "Failed to editing group"
      );
    } else {
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
};
