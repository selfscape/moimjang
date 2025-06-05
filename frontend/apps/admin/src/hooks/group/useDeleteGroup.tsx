import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteGroup } from "api/group/deleteGroup";
import { GET_CHANNELS } from "constants/queryKeys";

const useDeleteGroup = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: deleteGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_CHANNELS] });
    },
  });
};

export default useDeleteGroup;
