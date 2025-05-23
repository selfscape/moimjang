import { ACCEESS_TOKEN, OWNER, serverUrl } from "configs";

import axiosInstance from "../../axiosInstance";
import { Question } from "interfaces/brand/survey";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

export interface SurveyType {
  brand_id: string;
  title: string;
  description: string;
  questions: Array<Question>;
}

export const fetchCreateSurvey = async (
  requestBody: SurveyType
): Promise<Array<SurveyType>> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);
  const owner = localStorage.getItem(OWNER);

  const result = await axiosInstance.post(`${serverUrl}/surveys`, requestBody, {
    headers: {
      Authorization: `Bearer ${token}`,
      owner,
    },
  });
  return result.data;
};

const useCreateSurvey = () =>
  useMutation<Array<SurveyType>, AxiosError, SurveyType>({
    mutationFn: fetchCreateSurvey,
  });

export default useCreateSurvey;
