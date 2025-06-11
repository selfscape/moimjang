import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GET_MATCHED_USER } from "@/app/_constant/queryKeys";

import { ACCEESS_TOKEN } from "@constants/auth";
import { serverUrl } from "@/app/_constant/config";
import { Game } from "@model/channel/game";
import { User } from "@model/user";

export interface Response {
  game: Game;
  matched_user: User;
}

export const getMatchedUser = async (
  channel_id: string | string[] | undefined,
  token: string | null,
  owner: string | null
): Promise<Array<Response>> => {
  const response = await fetch(
    `${serverUrl}/customers/games/matched_user?channel_id=${channel_id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Owner: owner || "",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch matched users");
  }
  return response.json();
};

const useGetMatchedUser = (
  channelId: string | string[] | undefined,
  owner: string | null
) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem(ACCEESS_TOKEN);
    setToken(token);
  }, []);

  return useQuery({
    queryKey: [GET_MATCHED_USER, channelId, owner],
    queryFn: () => getMatchedUser(channelId, token, owner),
    enabled: Boolean(channelId) && Boolean(token) && Boolean(owner),
  });
};

export default useGetMatchedUser;
