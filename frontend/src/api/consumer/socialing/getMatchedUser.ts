import { ACCEESS_TOKEN, serverUrl } from "configs";
import { Game } from "interfaces/game";
import { User } from "interfaces/user";
import axiosInstance from "api/consumer/axiosInstance";

export interface GetMatchedUserOutput {
  game: Game;
  matched_user: User;
}

export const getMatchedUser = async (
  channel_id: string
): Promise<Array<GetMatchedUserOutput>> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);

  const response = await axiosInstance.get(
    `${serverUrl}/customers/games/matched_user?channel_id=${channel_id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        channel_id,
      },
    }
  );

  return response.data;
};
