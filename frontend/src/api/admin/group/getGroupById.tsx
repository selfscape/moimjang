import axios from "axios";
import { ACCEESS_TOKEN, serverUrl } from "configs";
import { ErrorDetail } from "interfaces";
import axiosInstance from "../axiosInstance";

// Function to get channel by ID
export const getGroupById = async (group_id: number) => {
  const token = localStorage.getItem(ACCEESS_TOKEN);
  const response = await axiosInstance.get(`${serverUrl}/groups/${group_id}`, {
    headers: {
      group_id,
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
