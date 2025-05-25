import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getReviewList } from "api/consumer/socialing/getReveiwList";
import { GET_REVIEW } from "constants/consumer/queryKeys";
import { Review } from "interfaces/channels";

const useGetReviewList = () => {
  const { channelId } = useParams();

  const { data, isLoading, error, isSuccess, refetch } = useQuery<
    Array<Review>,
    Error
  >({
    queryKey: [GET_REVIEW, channelId],
    queryFn: () => getReviewList(channelId),
    enabled: !!channelId,
  });

  return {
    data,
    refetch,
    isLoading,
    isSuccess,
    error,
  };
};

export default useGetReviewList;
