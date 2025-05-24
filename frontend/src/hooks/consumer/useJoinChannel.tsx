import { useMutation } from "@tanstack/react-query";
import { joinChannel } from "api/consumer/joinChannel";
import { AxiosError } from "axios";

const useJoinChannel = () => {
  return useMutation<void, AxiosError, number>({
    mutationFn: (channelId) => joinChannel(channelId),
  });
};

export default useJoinChannel;
