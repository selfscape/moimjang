import { useQuery } from "@tanstack/react-query";
import { GET_CHANNELS } from "constants/consumer/queryKeys";
import {
  getChannels,
  GetChannelsOutput,
} from "api/consumer/socialing/getChannels";

const useGetChannels = () => {
  const { data, isLoading, error, isSuccess, refetch } = useQuery<
    Array<GetChannelsOutput>,
    Error
  >({
    queryKey: [GET_CHANNELS],
    queryFn: getChannels,
  });

  return {
    data,
    refetch,
    isLoading,
    isSuccess,
    error,
  };
};

export default useGetChannels;
