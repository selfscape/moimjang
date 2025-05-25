import { useQuery } from "@tanstack/react-query";
import { getMyInfo } from "api/consumer/getMyInfo";
import { GET_MY_INFO } from "constants/consumer/queryKeys";
import { User } from "interfaces/user";

const useGetMyInfo = () => {
  const { data, isLoading, error, isSuccess, refetch } = useQuery<User, Error>({
    queryKey: [GET_MY_INFO],
    queryFn: getMyInfo,
  });

  return {
    data,
    refetch,
    isLoading,
    isSuccess,
    error,
  };
};

export default useGetMyInfo;
