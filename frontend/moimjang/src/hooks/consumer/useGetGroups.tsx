import { useQuery } from "@tanstack/react-query";

import { getGroups } from "api/consumer/socialing/getGroups";
import { GET_GROUPS } from "constants/consumer/queryKeys";
import { Group } from "interfaces/group";
import { useParams } from "react-router-dom";

const useGetGroups = () => {
  const { channelId } = useParams();

  const { data, isLoading, error, isSuccess, refetch } = useQuery<
    Array<Group>,
    Error
  >({
    queryKey: [GET_GROUPS, channelId],
    queryFn: () => getGroups(channelId),
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

export default useGetGroups;
