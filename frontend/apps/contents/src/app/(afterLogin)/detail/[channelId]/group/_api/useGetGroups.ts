import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

import { GET_GROUPS } from "@/app/_constant/queryKeys";
import { Group } from "@model/channel/group";
import { ACCEESS_TOKEN } from "@constants/auth";
import { serverUrl } from "@/app/_constant/config";

export const getGroups = async (
  channelId: string | string[] | undefined,
  token: string | null,
  owner: string | null
): Promise<Array<Group>> => {
  const result = await fetch(
    `${serverUrl}/customers/groups?channel_id=${channelId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Owner: owner || "",
      },
      cache: "no-store",
    }
  );
  if (!result.ok) {
    throw new Error("Failed to fetch data");
  }
  return result.json();
};

const useGetGroups = (
  owner: string,
  channelId: string | string[] | undefined
) => {
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    const token = localStorage.getItem(ACCEESS_TOKEN);
    setToken(token);
  }, []);

  return useQuery<Array<Group>, Error>({
    queryKey: [GET_GROUPS, channelId, owner],
    queryFn: () => getGroups(channelId, token, owner),
    enabled: Boolean(channelId) && Boolean(token) && Boolean(owner),
  });
};

export default useGetGroups;
