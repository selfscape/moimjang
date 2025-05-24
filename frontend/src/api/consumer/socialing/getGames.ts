import axios from "axios";
import { ACCEESS_TOKEN, serverUrl } from "configs";
import { Game } from "interfaces/game";
import axiosInstance from "api/consumer/axiosInstance";

export const getGames = async (): Promise<Array<Game>> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);

  const response = await axiosInstance.get(`${serverUrl}/customers/games`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
