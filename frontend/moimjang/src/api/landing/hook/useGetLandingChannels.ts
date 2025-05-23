import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "..";

import { OWNER, serverUrl } from "configs";
import { GET_LANDING_CHANNELS } from "constants/landing/queryKeys";
import { LandingChannel } from "../type/landingChannels";
import { ChannelState } from "interfaces/channels";

export interface Parmas {
  brand_id: string;
  state: ChannelState;
  sort_by: string;
  descending: boolean;
}

export interface GetLandingChannelsOutput {
  channels: Array<LandingChannel>;
  totalCount: number;
}

export const getLandingChannels = async (
  params: Parmas
): Promise<GetLandingChannelsOutput> => {
  const owner = localStorage.getItem(OWNER);

  const response = await axiosInstance.get(`${serverUrl}/landing/channels`, {
    params,
    headers: {
      owner,
    },
  });

  return response.data;
};

const useGetLandingChannels = (params: Parmas) =>
  useQuery({
    queryKey: [GET_LANDING_CHANNELS],
    queryFn: () => getLandingChannels(params),
  });

export default useGetLandingChannels;
