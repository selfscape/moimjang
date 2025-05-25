import { useQuery } from "@tanstack/react-query";
import { GET_CHANNELS } from "constants/consumer/queryKeys";
import { Channel } from "api/admin/channel/type/channel";
import { AxiosError } from "axios";
import { ACCEESS_TOKEN, OWNER, serverUrl } from "configs";
import axiosInstance from "api/consumer/axiosInstance";
import { ChannelState } from "interfaces/channels";

export interface Output {
  channels: Array<Channel>;
  totalCount: number;
}

export interface Params {
  state?: ChannelState;
  sort_by?: string;
  descending?: boolean;
}

export const fetchGetChannelList = async (params: Params): Promise<Output> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);
  const owner = localStorage.getItem(OWNER);

  const response = await axiosInstance.get(
    `${serverUrl}/customers/channel_list`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        owner,
      },
      params,
    }
  );

  return response.data;
};

const useGetChannelList = (params: Params = {}) => {
  const queryKey = [GET_CHANNELS, params] as const;

  const { data, isLoading, error, isSuccess, refetch } = useQuery<
    Output,
    AxiosError
  >({
    queryKey,
    queryFn: () => fetchGetChannelList(params),
  });

  return {
    data,
    isLoading,
    isSuccess,
    error,
    refetch,
  };
};

export default useGetChannelList;
