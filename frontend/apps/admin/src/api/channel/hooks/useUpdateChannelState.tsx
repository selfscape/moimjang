import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";

import { updateChannelState } from "../queries/updateChannelState";
import { Channel, ChannelState } from "../type/channel";

interface Variables {
  channel_id: number;
  channel_state: ChannelState;
}

const useUpdateChannelState = () => {
  return useMutation<Channel, AxiosError, Variables>({
    mutationFn: updateChannelState,
  });
};

export default useUpdateChannelState;
