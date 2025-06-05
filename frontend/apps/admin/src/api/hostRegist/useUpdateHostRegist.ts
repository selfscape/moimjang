import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";

import axiosInstance from "api/axiosInstance";
import { ACCEESS_TOKEN, serverUrl } from "configs";
import { HostRegistState, User } from "interfaces/user";

export const updateHostRegist = async (
  host_regist_id: number,
  state: HostRegistState
): Promise<User> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);

  const result = await axiosInstance.put(
    `${serverUrl}/hostRegistAdmin/${host_regist_id}/state`,
    { state: state },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return result.data;
};

const useUpdateHostRegist = () =>
  useMutation<
    User,
    AxiosError,
    { host_regist_id: number; state: HostRegistState }
  >({
    mutationFn: ({ host_regist_id, state }) =>
      updateHostRegist(host_regist_id, state),
  });

export default useUpdateHostRegist;
