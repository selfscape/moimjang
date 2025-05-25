import { useQuery } from "@tanstack/react-query";
import {
  getChannelJoinedUsers,
  getChannelJoinedUsersOutput,
} from "api/consumer/socialing/getChannelJoinedUsers";
import { AxiosError } from "axios";

import { GET_CHANNEL_JOINED_USERS } from "constants/consumer/queryKeys";
import { useParams } from "react-router-dom";

const useGetChannelJoinedUsers = () => {
  const { channelId } = useParams();

  const { data, isLoading, error, isSuccess, refetch } = useQuery<
    Array<getChannelJoinedUsersOutput>,
    AxiosError
  >({
    queryKey: [GET_CHANNEL_JOINED_USERS, channelId],
    queryFn: () => getChannelJoinedUsers(channelId),
  });

  return {
    data,
    refetch,
    isLoading,
    isSuccess,
    error,
  };
};

export default useGetChannelJoinedUsers;
