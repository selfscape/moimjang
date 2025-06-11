import { ACCEESS_TOKEN, serverUrl } from "configs";
import axiosInstance from "../axiosInstance";
import { SurveyRegistState } from "interfaces/landing";

export interface Output {
  id: number;
  survey_id: number;
  user_id: number;
  response: Record<string, string>;
  submitted_at: string;
  regist_state: SurveyRegistState;
}

export const updateSurveyResponse = async ({
  response_id,
  regist_state,
}: {
  response_id: number;
  regist_state: SurveyRegistState;
}): Promise<Output> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);
  const result = await axiosInstance.put(
    `${serverUrl}/surveys/responses/${response_id}`,
    { regist_state },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return result.data;
};
