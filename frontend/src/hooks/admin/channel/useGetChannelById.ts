import { useQuery } from "@tanstack/react-query";
import { GET_CHANNELS_BY_ID } from "constants/admin/queryKeys";
import { getChannelsById } from "api/admin/channel/getChannelsById";
import { useParams } from "react-router-dom";
import { Channel } from "interfaces/channels";
import { AxiosError } from "axios";

const useGetChannelById = () => {
  const { channelId } = useParams();

  const { data, isLoading, error, isSuccess, refetch } = useQuery<
    Channel,
    AxiosError
  >({
    queryKey: [GET_CHANNELS_BY_ID, channelId],
    queryFn: () => getChannelsById(channelId),
    enabled: !!channelId,
  });

  return {
    data,
    channelId,
    isLoading,
    isSuccess,
    refetch,
    error,
  };
};

export default useGetChannelById;
