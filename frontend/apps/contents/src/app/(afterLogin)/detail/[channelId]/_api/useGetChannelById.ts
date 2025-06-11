import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GET_CHANNELS_BY_ID } from "@/app/_constant/queryKeys";
import { ACCEESS_TOKEN } from "@constants/auth";
import { serverUrl } from "@/app/_constant/config";
import { Channel } from "@model/channel";

export const getChannelById = async (
  channelId: string | string[] | undefined,
  token: string | null,
  owner: string | null
): Promise<Channel> => {
  const result = await fetch(`${serverUrl}/customers/channel/${channelId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Owner: owner || "",
    },
    cache: "no-store",
  });
  if (!result.ok) throw new Error("Failed to fetch data");
  return result.json();
};

const useGetChannelById = (
  channelId: string | string[] | undefined,
  owner: string
) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem(ACCEESS_TOKEN);
    setToken(token);
  }, []);

  return useQuery({
    queryKey: [GET_CHANNELS_BY_ID, channelId, owner],
    queryFn: () => getChannelById(channelId, token, owner),
    staleTime: 60 * 1000,
    enabled: Boolean(channelId) && Boolean(token) && Boolean(owner),
  });
};

export default useGetChannelById;
