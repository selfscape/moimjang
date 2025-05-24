import { getChannelById } from "api/consumer/socialing/getChannelById";
import { useParams } from "react-router-dom";
import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import { Channel } from "interfaces/channels";
import { GET_CHANNELS_BY_ID } from "constants/consumer/queryKeys";

const useGetChannelById = () => {
  const { channelId } = useParams();

  const { data, isLoading, error, isSuccess, refetch } = useQuery<
    Channel,
    AxiosError
  >({
    queryKey: [GET_CHANNELS_BY_ID, channelId],
    queryFn: () => getChannelById(channelId),
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
