import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { ACCEESS_TOKEN, serverUrl, USER_NAME } from "configs";

import axiosInstance from "../../axiosInstance";
import { Question } from "interfaces/brand/survey";

export interface SurveyType {
  brand_id: string;
  title: string;
  description: string;
  questions: Array<Question>;
}

export const fetchUpdateSurvey = async (
  requestBody: SurveyType,
  survey_id: string
): Promise<SurveyType> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);
  const owner = localStorage.getItem(USER_NAME);

  const result = await axiosInstance.put(
    `${serverUrl}/surveys/${survey_id}`,
    requestBody,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        owner,
      },
    }
  );
  return result.data;
};

const useUpdateSurvey = () =>
  useMutation<
    SurveyType,
    AxiosError,
    { requestBody: SurveyType; survey_id: string }
  >({
    mutationFn: ({ requestBody, survey_id }) =>
      fetchUpdateSurvey(requestBody, survey_id),
  });

export default useUpdateSurvey;
