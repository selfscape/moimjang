import { useQuery } from "@tanstack/react-query";

import { AxiosError } from "axios";
import axiosInstance from "api/axiosInstance";
import { GET_USERS } from "constants/queryKeys";
import { ACCEESS_TOKEN, serverUrl, USER_NAME } from "configs";
import { User } from "interfaces/user";

export interface GetUsersOutput {
  users: Array<User>;
  totalCount: number;
}

export interface GetUserParams {
  sort_by: string;
  descending: boolean;
  offset: number;
  limit: number;
}

export const getUsers = async (
  params: GetUserParams
): Promise<GetUsersOutput> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);
  const owner = localStorage.getItem(USER_NAME);

  const response = await axiosInstance.get(`${serverUrl}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
      owner,
    },
    params,
  });
  return response.data;
};

const useGetUsers = (params: GetUserParams) => {
  const { data, isLoading, error, isSuccess, refetch } = useQuery<
    GetUsersOutput,
    AxiosError
  >({
    queryKey: [GET_USERS, params],
    queryFn: () => getUsers(params),
    staleTime: 5 * 60 * 1000,
  });

  return {
    data,
    refetch,
    isLoading,
    isSuccess,
    error,
  };
};

export default useGetUsers;
