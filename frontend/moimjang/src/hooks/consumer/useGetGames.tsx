import { useQuery } from "@tanstack/react-query";
import { GET_GAMES } from "constants/consumer/queryKeys";
import { Game } from "interfaces/game";
import { getGames } from "api/consumer/socialing/getGames";

const useGetGames = () => {
  const { data, isLoading, error, isSuccess, refetch } = useQuery<
    Array<Game>,
    Error
  >({
    queryKey: [GET_GAMES],
    queryFn: getGames,
  });

  return {
    data,
    refetch,
    isLoading,
    isSuccess,
    error,
  };
};

export default useGetGames;
