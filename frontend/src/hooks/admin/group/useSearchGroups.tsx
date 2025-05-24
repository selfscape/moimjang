import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSearchGroups } from "api/admin/group/getSearchGroups";
import { Group } from "interfaces/group";
import { GET_SERACH_GROUPS } from "constants/admin/queryKeys";

const useSearchGroups = (channel_id: number) => {
  const [enabled, setEnabled] = useState(false); // Control the query execution manually

  const { data, isLoading, error, isSuccess, refetch } = useQuery<
    Array<Group>,
    Error
  >({
    queryKey: [GET_SERACH_GROUPS, channel_id],
    queryFn: () => getSearchGroups(channel_id),
    enabled,
  });

  const triggerQuery = () => {
    setEnabled(true);
  };

  return {
    data,
    isLoading,
    error,
    isSuccess,
    triggerQuery,
    refetch,
  };
};

export default useSearchGroups;
