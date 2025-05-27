import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editChannel, EditChannelInput } from "api/admin/channel/editChannel";
import { GET_CHANNELS } from "constants/admin/queryKeys";

interface EditChannelVariables {
  channel_id: string;
  channelData: EditChannelInput;
}

const useEditChannel = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, EditChannelVariables>({
    mutationFn: ({ channel_id, channelData }) =>
      editChannel(channel_id, channelData),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_CHANNELS] });
    },
  });
};

export default useEditChannel;
