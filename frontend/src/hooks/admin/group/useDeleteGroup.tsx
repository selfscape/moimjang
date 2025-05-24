import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteGroup } from "api/admin/group/deleteGroup";
import { GET_CHANNELS } from "constants/admin/queryKeys";

const useDeleteGroup = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: deleteGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GET_CHANNELS });
    },
  });
};

export default useDeleteGroup;
