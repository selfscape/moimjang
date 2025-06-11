import { useQuery } from "@tanstack/react-query";
import { OWNER } from "@constants/auth";
import { serverUrl } from "@/app/_constant/config";
import { Channel, ChannelState } from "@model/channel";
import { GET_LANDING_CHANNELS } from "@/app/_constant/channel/queryKey";
import useCookie from "@util/hooks/useCookie";

export interface Params {
  brand_id: string;
  state: ChannelState;
  sort_by: string;
  descending: boolean;
}

export interface Response {
  channels: Array<Channel>;
  totalCount: number;
}

export const getLandingChannels = async (
  params: Params,
  owner: string
): Promise<Response> => {
  const queryString = new URLSearchParams({
    brand_id: params.brand_id,
    state: params.state,
    sort_by: params.sort_by,
    descending: params.descending.toString(),
  }).toString();

  const result = await fetch(`${serverUrl}/landing/channels?${queryString}`, {
    method: "GET",
    headers: {
      Owner: owner,
    },
    next: {
      tags: [GET_LANDING_CHANNELS],
    },
    cache: "no-store",
  });
  if (!result.ok) new Error("Failed to fetch data");

  return result.json();
};

const useGetLandingChannels = (params: Params) => {
  const owner = useCookie(OWNER);

  return useQuery({
    queryKey: [GET_LANDING_CHANNELS, params],
    queryFn: () => getLandingChannels(params, owner),
    staleTime: 60 * 1000,
    enabled: !!owner,
  });
};

export default useGetLandingChannels;
