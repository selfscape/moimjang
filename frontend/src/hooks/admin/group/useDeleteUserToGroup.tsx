import React from "react";
import { Axios, AxiosError } from "axios";

import { QueryClient, useMutation } from "@tanstack/react-query";
import { deleteUserToGroup } from "api/admin/group/deleteUsersToGroup";
import { GET_SERACH_GROUPS } from "constants/admin/queryKeys";

interface DeleteUsersToGroupVariable {
  group_id: number;
  user_id: number;
}

const useDeleteUserToGroup = () => {
  const queryClient = new QueryClient();

  return useMutation<unknown, AxiosError, DeleteUsersToGroupVariable>({
    mutationFn: ({ group_id, user_id }) => deleteUserToGroup(user_id, group_id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [GET_SERACH_GROUPS] }),
  });
};

export default useDeleteUserToGroup;
