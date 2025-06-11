import axios from "axios";
import { ACCEESS_TOKEN, serverUrl } from "configs";
import axiosInstance from "../axiosInstance";

export const getUserById = async (userId: string) => {
  const token = localStorage.getItem(ACCEESS_TOKEN);
  try {
    const response = await axiosInstance.get(`${serverUrl}/users/${userId}`, {
      headers: {
        user_id: userId,
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 422) {
      console.error("Validation Error:", error.response.data);
    } else {
      console.error("Error fetching user data:", error);
    }
    throw error;
  }
};
