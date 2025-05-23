import { OWNER, serverUrl } from "configs";
import { axiosInstance } from ".";
import { SurveyRegistState } from "interfaces/landing";

export interface RequestBody {
  channelId: number;
  answers: Array<Record<string, string>>;
}

export interface Output {
  id: number;
  survey_id: number;
  channelId: number;
  user_id: number;
  response: Record<string, string>;
  submitted_at: string;
  regist_state: SurveyRegistState;
}

export const createSurvey = async (
  requestBody: RequestBody,
  survey_id: string
): Promise<Output> => {
  const owner = localStorage.getItem(OWNER);

  const result = await axiosInstance.post(
    `${serverUrl}/landing/surveys/responses`,
    requestBody,
    {
      params: {
        survey_id,
      },
      headers: {
        owner,
      },
    }
  );

  return result.data;
};
