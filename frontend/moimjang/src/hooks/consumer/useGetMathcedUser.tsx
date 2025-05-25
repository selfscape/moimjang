import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { GET_MATCHED_USER } from "constants/consumer/queryKeys";
import { useParams } from "react-router-dom";

import { getMatchedUser } from "api/consumer/socialing/getMatchedUser";
import { GetMatchedUserOutput } from "api/consumer/socialing/getMatchedUser";

const useGetMatchedUser = () => {
  const { channelId } = useParams();

  const { data, isLoading, error, isSuccess, refetch } = useQuery<
    Array<GetMatchedUserOutput>,
    AxiosError
  >({
    queryKey: [GET_MATCHED_USER, channelId],
    queryFn: () => getMatchedUser(channelId),
    enabled: !!channelId,
  });

  return {
    data,
    refetch,
    isLoading,
    isSuccess,
    error,
  };
};

export default useGetMatchedUser;
