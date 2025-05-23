import { AxiosError } from "axios";
import { ACCEESS_TOKEN, serverUrl } from "configs";
import axiosInstance from "api/admin/axiosInstance";
import { useQuery } from "@tanstack/react-query";

import { GET_SURVEY_BY_ID } from "constants/admin/queryKeys";
import { Survey } from "interfaces/brand/survey";

export const fetchGetSurveyById = async (
  survey_id: number
): Promise<Survey> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);

  const response = await axiosInstance.get(
    `${serverUrl}/surveys/${survey_id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
2;
const useGetSurveyById = (survey_id: number) =>
  useQuery<Survey, AxiosError>({
    queryKey: [GET_SURVEY_BY_ID, survey_id],
    queryFn: () => fetchGetSurveyById(survey_id),
  });

export default useGetSurveyById;
