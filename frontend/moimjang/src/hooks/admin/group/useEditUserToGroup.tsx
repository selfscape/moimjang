import { AxiosError } from "axios";

import { QueryClient, useMutation } from "@tanstack/react-query";
import { deleteUserToGroup } from "api/admin/group/deleteUsersToGroup";
import { GET_SERACH_GROUPS } from "constants/admin/queryKeys";

import editGroupToUser, {
  EditGroupToUserOutput,
  EditGroupToUserRequestBody,
} from "api/admin/group/editUserToGroup";

interface EditUserToGroupVariable {
  group_id: number;
  user_id: number;
  requestBody: EditGroupToUserRequestBody;
}

const useEditUserToGroup = () => {
  const queryClient = new QueryClient();

  return useMutation<
    EditGroupToUserOutput,
    AxiosError,
    EditUserToGroupVariable
  >({
    mutationFn: ({ group_id, user_id, requestBody }) =>
      editGroupToUser(user_id, group_id, requestBody),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: GET_SERACH_GROUPS }),
  });
};

export default useEditUserToGroup;
