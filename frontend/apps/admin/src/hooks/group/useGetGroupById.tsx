import { useQuery } from "@tanstack/react-query";
import { GET_GROUP_BY_ID } from "constants/queryKeys";
import { Channel } from "interfaces/channels";
import { getGroupById } from "api/group/getGroupById";

const useGetGroupById = (group_id: number) => {
  const { data, isLoading, error, isSuccess } = useQuery<Channel, Error>({
    queryKey: [GET_GROUP_BY_ID],
    queryFn: () => getGroupById(group_id),
  });

  return {
    data,
    isLoading,
    isSuccess,
    error,
  };
};

export default useGetGroupById;
