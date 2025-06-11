import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { GET_USERS_NOT_IN_GROUP } from "constants/queryKeys";
import { User } from "interfaces/user";
import { getUsersNotInGroup } from "api/users/getUsersNotInGroup";
import { AxiosError } from "axios";

const useGetUsersNotInGroup = () => {
  const { channelId } = useParams();

  const { data, isLoading, error, isSuccess, refetch } = useQuery<
    Array<User>,
    AxiosError
  >({
    queryKey: [GET_USERS_NOT_IN_GROUP, channelId],
    queryFn: () => getUsersNotInGroup(channelId),
    enabled: !!channelId,
    retry: (failureCount, error) => {
      const errorMessage = (error?.response?.data as { detail: string })
        ?.detail;
      return errorMessage === "조건에 맞는 사용자가 없습니다."
        ? false
        : failureCount < 1;
    },
  });

  const errorMessage = error?.response?.data as { detail: string };
  const hasNoUsers = errorMessage?.detail === "조건에 맞는 사용자가 없습니다.";

  return {
    data: hasNoUsers ? [] : data,
    channelId,
    isLoading,
    isSuccess,
    refetch,
    error,
  };
};

export default useGetUsersNotInGroup;
