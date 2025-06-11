import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { SurveyRegistState } from "@model/form";
import { serverUrl } from "@/app/_constant/config";
import useCookie from "@util/hooks/useCookie";
import { USER_NAME } from "@constants/auth";

export interface RequestBody {
  channelId: string;
  answers: Array<Record<string, string>>;
}

export interface Response {
  id: number;
  survey_id: number;
  channelId: string;
  user_id: number;
  response: Record<string, string>;
  submitted_at: string;
  regist_state: SurveyRegistState;
}

export const registForm = async (
  requestBody: RequestBody,
  survey_id: string,
  owner: string
): Promise<Response> => {
  const response = await fetch(
    `${serverUrl}/landing/surveys/responses?survey_id=${survey_id}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Owner: owner,
      },
      body: JSON.stringify(requestBody),
      cache: "no-cache",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to regist form");
  }

  const result = await response.json();

  return result;
};

const useRegistForm = () => {
  const owner = useCookie(OWNER);

  return useMutation<
    Response,
    AxiosError,
    {
      requestBody: RequestBody;
      survey_id: string;
    }
  >({
    mutationFn: ({ requestBody, survey_id }) =>
      registForm(requestBody, survey_id, owner),
  });
};

export default useRegistForm;
