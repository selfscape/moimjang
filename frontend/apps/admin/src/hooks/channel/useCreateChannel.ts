import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createChannel, CreateChannelInput } from "api/channel/createChannel";
import { AxiosError } from "axios";
import { GET_CHANNELS } from "constants/queryKeys";

const useCreateChannel = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, CreateChannelInput>({
    mutationFn: createChannel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_CHANNELS] });
    },
  });
};

export default useCreateChannel;
