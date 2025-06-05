import { useQuery } from "@tanstack/react-query";

import { GET_GROUPS } from "@/app/_constant/queryKeys";
import { useState, useEffect } from "react";
import { Group } from "@model/channel/group";
import { serverUrl } from "@constants/config";
import { ACCEESS_TOKEN } from "@constants/auth";

export const getGroups = async (
  channel_id: string | string[] | undefined,
  token: string | null
): Promise<Array<Group>> => {
  const response = await fetch(
    `${serverUrl}/customers/groups?channel_id=${channel_id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch groups");
  }
  return response.json();
};

const useGetGroups = (
  channelId: string | string[] | undefined,
  owner: string | null
) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const tok = localStorage.getItem(ACCEESS_TOKEN);
    setToken(tok);
  }, []);

  return useQuery<Array<Group>, Error>({
    queryKey: [GET_GROUPS, channelId, owner],
    queryFn: () => getGroups(channelId!, token),
    enabled: Boolean(channelId) && Boolean(token),
  });
};

export default useGetGroups;
