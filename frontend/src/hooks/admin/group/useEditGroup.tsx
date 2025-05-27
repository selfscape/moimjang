import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  editGroup,
  EditGroupOutput,
  EditGroupInput,
} from "api/admin/group/editGroup";

import { GET_CHANNELS } from "constants/admin/queryKeys";

interface EditChannelVariables {
  group_id: number;
  groupData: EditGroupInput;
}

const useEditGroup = () => {
  const queryClient = useQueryClient();

  return useMutation<EditGroupOutput, Error, EditChannelVariables>({
    mutationFn: ({ group_id, groupData }) => editGroup(group_id, groupData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_CHANNELS] });
    },
  });
};

export default useEditGroup;
