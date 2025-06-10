import { QueryClient, useMutation } from "@tanstack/react-query";

import { AxiosError } from "axios";
import axiosInstance from "api/axiosInstance";
import { ACCEESS_TOKEN, OWNER, serverUrl } from "configs";
import { GET_SEARCH_GAMES } from "constants/queryKeys";
import { Game } from "interfaces/game";
import { getCookie } from "hooks/auth/useOwnerCookie";

export interface IRequestBody {
  group_id: number;
  pointed_users: Array<Array<number>>;
}

export const createGamePairs = async (
  requestBody: IRequestBody
): Promise<Array<Game>> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);
  const owner = getCookie(OWNER);

  const result = await axiosInstance.post(
    `${serverUrl}/games/pairs`,
    requestBody,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        owner,
      },
    }
  );
  return result.data;
};

const useCreateGameParis = () => {
  const queryClient = new QueryClient();

  return useMutation<Array<Game>, AxiosError, IRequestBody>({
    mutationFn: (requestBody) => createGamePairs(requestBody),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [GET_SEARCH_GAMES] }),
  });
};

export default useCreateGameParis;
