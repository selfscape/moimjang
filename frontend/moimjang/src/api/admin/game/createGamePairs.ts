import { ACCEESS_TOKEN, serverUrl } from "configs";
import { Game } from "interfaces/game";

import axiosInstance from "../axiosInstance";

export interface IRequestBody {
  group_id: number;
  pointed_users: Array<Array<number>>;
}

export const createGamePairs = async (
  requestBody: IRequestBody
): Promise<Array<Game>> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);

  const result = await axiosInstance.post(
    `${serverUrl}/games/pairs`,
    requestBody,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return result.data;
};
