import { useQuery } from "@tanstack/react-query";

import { USER_NAME } from "@constants/auth";
import { serverUrl } from "@/app/_constant/config";
import { GET_SURVEYS } from "@/app/_constant/queryKeys";
import { Survey } from "@model/form";
import useCookie from "@util/hooks/useCookie";

export const getSurveys = async (
  brand_id: string,
  owner: string
): Promise<Array<Survey>> => {
  const queryString = new URLSearchParams({
    brand_id,
  }).toString();

  const result = await fetch(`${serverUrl}/landing/surveys?${queryString}`, {
    method: "GET",
    headers: {
      Owner: owner,
    },
    next: {
      tags: [GET_SURVEYS],
    },
    cache: "no-store",
  });

  if (!result.ok) new Error("Failed to fetch data");

  return result.json();
};

const useGetSurveys = (brand_id: string) => {
  const owner = useCookie(OWNER);

  return useQuery<Array<Survey>, Error>({
    queryKey: [GET_SURVEYS, brand_id],
    queryFn: () => getSurveys(brand_id, owner),
    staleTime: 60 * 1000,
    enabled: Boolean(brand_id) && Boolean(owner),
  });
};

export default useGetSurveys;
