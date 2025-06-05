import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GET_SEARCH_GAMES } from "constants/queryKeys";
import { getSearchGames } from "api/game/getSearchGames";
import { Game } from "interfaces/game";

const useSearchGames = (group_id: number) => {
  const [enabled, setEnabled] = useState(false);

  const { data, isLoading, error, isSuccess, refetch } = useQuery<
    Array<Game>,
    Error
  >({
    queryKey: [GET_SEARCH_GAMES, group_id],
    queryFn: () => getSearchGames(group_id),
    enabled: enabled,
  });

  const triggerQuery = () => {
    setEnabled(true);
  };

  return {
    data,
    isLoading,
    error,
    isSuccess,
    triggerQuery,
    refetch,
  };
};

export default useSearchGames;
