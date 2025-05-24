import axios from "axios";
import { ACCEESS_TOKEN, serverUrl } from "configs";
import { Channel } from "interfaces/channels";
import axiosInstance from "../axiosInstance";

// Function to get channel by ID
export const getChannelsById = async (id: string) => {
  const token = localStorage.getItem(ACCEESS_TOKEN);
  const response = await axiosInstance.get(`${serverUrl}/channels/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Handle success response (status 200)
  return response.data as Channel;
};
