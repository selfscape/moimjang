import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";

import axiosInstance from "api/admin/axiosInstance";
import { ACCEESS_TOKEN, serverUrl } from "configs";
import { User } from "interfaces/user";

export const createHostRegist = async (): Promise<User> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);

  const result = await axiosInstance.post(
    `${serverUrl}/hostRegist`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return result.data;
};

const useCreateHostRegist = () =>
  useMutation<User, AxiosError, void>({
    mutationFn: createHostRegist,
  });

export default useCreateHostRegist;
