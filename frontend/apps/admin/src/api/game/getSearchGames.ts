import { ACCEESS_TOKEN, serverUrl } from "configs";
import { Game } from "interfaces/game";
import axiosInstance from "../axiosInstance";

export const getSearchGames = async (
  group_id: number
): Promise<Array<Game>> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);
  const response = await axiosInstance.get(
    `${serverUrl}/games/search?group_id=${group_id}`,
    {
      headers: {
        group_id,
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
