import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteChannel } from "api/admin/channel/deleteChannel";
import { GET_CHANNELS } from "constants/admin/queryKeys";

const useDeleteChannel = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, string>({
    mutationFn: (channelId) => deleteChannel(channelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_CHANNELS] });
    },
  });
};

export default useDeleteChannel;
