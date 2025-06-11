import { QueryClient, useMutation } from "@tanstack/react-query";

import { AxiosError } from "axios";
import axiosInstance from "api/axiosInstance";
import { ACCEESS_TOKEN, serverUrl, USER_NAME } from "configs";
import { GET_SEARCH_GAMES } from "constants/queryKeys";
import { Game } from "interfaces/game";

export interface IRequestBody {
  group_id: number;
  pointed_users: Array<Array<number>>;
}

export const createGamePairs = async (
  requestBody: IRequestBody
): Promise<Array<Game>> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);
  const owner = localStorage.getItem(USER_NAME);

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
