import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GET_CHANNEL_LIST } from "@/app/_constant/queryKeys";
import { ACCEESS_TOKEN } from "@constants/auth";
import { serverUrl } from "@/app/_constant/config";
import { Channel, ChannelState } from "@model/channel";

export interface Output {
  channels: Array<Channel>;
  totalCount: number;
}

export interface Params {
  state: ChannelState;
  sort_by: string;
  descending: boolean;
  offset: number;
  limit: number;
}

export interface Response {
  channels: Array<Channel>;
  totalCount: number;
}

export const getChannelList = async (
  params: Params,
  token: string | null,
  owner: string | null
): Promise<Response> => {
  const queryString = new URLSearchParams({
    state: params.state,
    sort_by: params.sort_by,
    descending: params.descending.toString(),
    limit: params.limit.toString(),
  }).toString();

  const result = await fetch(
    `${serverUrl}/customers/channel_list?${queryString}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Owner: owner || "",
      },
      next: {
        tags: [GET_CHANNEL_LIST],
      },
      cache: "no-store",
    }
  );
  if (!result.ok) new Error("Failed to fetch data");

  return result.json();
};

const useGetChannelList = (params: Params, owner: string) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem(ACCEESS_TOKEN);
    setToken(token);
  }, []);

  return useQuery<Response, Error>({
    queryKey: [GET_CHANNEL_LIST, params],
    queryFn: () => getChannelList(params, token, owner),
    staleTime: 60 * 1000,
    enabled: Boolean(owner) && Boolean(token), // token이 null이 아닐 때만 실행
  });
};

export default useGetChannelList;
