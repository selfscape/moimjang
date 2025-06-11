import { useMutation, useQueryClient } from "@tanstack/react-query";
import { joinChannel, JoinChannelInput } from "api/users/joinChannel";
import { AxiosError } from "axios";
import { GET_USERS } from "constants/queryKeys";

const useJoinChannel = () => {
  const queryClient = useQueryClient(); // ✅ QueryClient 인스턴스 가져오기

  return useMutation<void, AxiosError, JoinChannelInput>({
    mutationFn: ({ userId, channelId }) => joinChannel(userId, channelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_USERS] });
    },
  });
};

export default useJoinChannel;
