import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { deleteChannelUser } from "api/admin/users/deleteChannelUser";

const useDeleteChannelUser = () => {
  return useMutation<void, AxiosError, { user_id: number; channel_id: string }>(
    {
      mutationFn: ({ user_id, channel_id }) =>
        deleteChannelUser(user_id, channel_id),
    }
  );
};

export default useDeleteChannelUser;
