import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { GET_SURVEY_RESPONSES } from "constants/queryKeys";
import { SurveyResponse } from "interfaces/landing";
import { ACCEESS_TOKEN, serverUrl, USER_NAME } from "configs";
import axiosInstance from "api/axiosInstance";

export interface GetSurveyResponseParams {
  survey_id: string;
  channel_id: string;
  sort_by: string;
  descending: boolean;
  offset: number;
  limit: number;
}

export interface GetSurveyResponseOutput {
  totalCount: number;
  responses: Array<SurveyResponse>;
}

export const getSurveyResponses = async (
  params: GetSurveyResponseParams
): Promise<GetSurveyResponseOutput> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);
  const owner = localStorage.getItem(USER_NAME);

  const response = await axiosInstance.get(`${serverUrl}/surveysResponses`, {
    headers: {
      Authorization: `Bearer ${token}`,
      owner,
    },
    params,
  });

  return response.data;
};

const useGetSurveyResponses = (params: GetSurveyResponseParams) => {
  const { data, isLoading, error, isSuccess, refetch } = useQuery<
    GetSurveyResponseOutput,
    AxiosError
  >({
    queryKey: [GET_SURVEY_RESPONSES, params],
    queryFn: () => getSurveyResponses(params),
  });

  return {
    data,
    refetch,
    isLoading,
    isSuccess,
    error,
  };
};

export default useGetSurveyResponses;
