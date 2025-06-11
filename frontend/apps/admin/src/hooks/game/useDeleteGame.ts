import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteGame } from "api/game/deleteGame";
import { GET_SEARCH_GAMES } from "constants/queryKeys";

const useDeleteGame = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (gameId) => deleteGame(gameId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_SEARCH_GAMES] });
    },
  });
};

export default useDeleteGame;
