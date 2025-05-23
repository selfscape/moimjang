import { useQuery } from "@tanstack/react-query";
import { GET_USER_GROUPS } from "constants/admin/queryKeys";
import { getUserGroups } from "api/admin/group/getUserGroup";
import { Group } from "interfaces/group";

const useGetUserGroups = (user_id: number) => {
  const { data, isLoading, error, isSuccess, refetch } = useQuery<
    Array<Group>,
    Error
  >({
    queryKey: [GET_USER_GROUPS, user_id],
    queryFn: () => getUserGroups(user_id),
  });

  return {
    data,
    isLoading,
    isSuccess,
    error,
    refetch,
  };
};

export default useGetUserGroups;
