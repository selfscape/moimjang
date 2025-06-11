import { useMutation, useQueryClient } from "@tanstack/react-query";

import { GET_CHANNELS } from "constants/queryKeys";
import { addGroup, AddGroupInput, AddGroupOutput } from "api/users/addGroup";

interface AddGroupVariables {
  user_id: number;
  groupData: AddGroupInput;
}

const useAddGroup = () => {
  const queryClient = useQueryClient();

  return useMutation<AddGroupOutput, Error, AddGroupVariables>({
    mutationFn: ({ user_id, groupData }) => addGroup(user_id, groupData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_CHANNELS] });
    },
  });
};

export default useAddGroup;
