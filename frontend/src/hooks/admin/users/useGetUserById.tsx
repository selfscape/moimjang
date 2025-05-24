import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getUserById } from "api/admin/users/getUserById";
import { GET_USER_BY_ID } from "constants/admin/queryKeys";
import { User } from "interfaces/user";

const useGetUserById = () => {
  const { userId } = useParams();

  const { data, isLoading, error, isSuccess } = useQuery<User, Error>({
    queryKey: [GET_USER_BY_ID, userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });

  return {
    data,
    userId,
    isLoading,
    isSuccess,
    error,
  };
};

export default useGetUserById;
