import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import { ACCEESS_TOKEN, serverUrl, USER_NAME } from "configs";
import axiosInstance from "api/axiosInstance";
import { GET_SURVEYS } from "constants/queryKeys";
import { Survey } from "interfaces/brand/survey";

export const fetchGetSurvey = async (
  brand_id: string
): Promise<Array<Survey>> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);
  const owner = localStorage.getItem(USER_NAME);

  const response = await axiosInstance.get(`${serverUrl}/surveys`, {
    headers: {
      Authorization: `Bearer ${token}`,
      owner,
    },
    params: {
      brand_id,
    },
  });

  return response.data;
};

const useGetSurvey = (brand_id: string) =>
  useQuery<Array<Survey>, AxiosError>({
    queryKey: [GET_SURVEYS, brand_id],
    queryFn: () => fetchGetSurvey(brand_id),
    enabled: !!brand_id,
  });

export default useGetSurvey;
