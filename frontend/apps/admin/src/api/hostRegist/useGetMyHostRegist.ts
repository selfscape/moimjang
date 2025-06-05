import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import axiosInstance from "api/axiosInstance";
import { ACCEESS_TOKEN, serverUrl } from "configs";
import { GET_MY_HOST_REGIST } from "constants/queryKeys";
import { User } from "interfaces/user";

export const getMyHostRegist = async (): Promise<User> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);

  const result = await axiosInstance.get(`${serverUrl}/hostRegist/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return result.data;
};

const useGetMyHostRegist = () =>
  useQuery<User, AxiosError>({
    queryKey: [GET_MY_HOST_REGIST],
    queryFn: getMyHostRegist,
  });

export default useGetMyHostRegist;
