import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import axiosInstance from "api/axiosInstance";
import { ACCEESS_TOKEN, OWNER, serverUrl, USER_EMAIL } from "configs";
import { GET_CHANNELS } from "constants/queryKeys";
import { Channel, ChannelState } from "interfaces/channels/index";
import { getCookie } from "hooks/auth/useOwnerCookie";

export interface Output {
  channels: Array<Channel>;
  totalCount: number;
}

export interface Params {
  state: ChannelState;
  sort_by: string;
  descending: boolean;
  brand_id: number;
  offset: number;
  limit: number;
}

export const getChannels = async (params: Params): Promise<Output> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);
  const owner = getCookie(OWNER);

  const response = await axiosInstance.get(`${serverUrl}/channels`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Owner: owner,
    },
    params,
  });

  return response.data;
};

const useGetChannels = (parmas: Params) =>
  useQuery<Output, AxiosError>({
    queryKey: [GET_CHANNELS, parmas],
    queryFn: () => getChannels(parmas),
  });

export default useGetChannels;
