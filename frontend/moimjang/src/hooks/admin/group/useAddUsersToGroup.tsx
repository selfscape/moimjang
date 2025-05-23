import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
  addUsersToGroup,
  AddUsersToGroupInput,
  AddUsersToGroupOutput,
} from "api/admin/group/addUsersToGroup";
import { AxiosError } from "axios";
import {
  GET_SERACH_GROUPS,
  GET_USERS_NOT_IN_GROUP,
} from "constants/admin/queryKeys";

interface AddUsersToGroupVariable {
  group_id: number;
  requestBody: AddUsersToGroupInput;
}

const useAddUsersToGroup = () => {
  const queryClient = useQueryClient(); // 기존의 QueryClient 인스턴스 사용

  return useMutation<
    Array<AddUsersToGroupOutput>,
    AxiosError,
    AddUsersToGroupVariable
  >({
    mutationFn: ({ group_id, requestBody }) =>
      addUsersToGroup(group_id, requestBody),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [GET_SERACH_GROUPS, GET_USERS_NOT_IN_GROUP],
      }),
  });
};

export default useAddUsersToGroup;
