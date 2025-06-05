import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ACCEESS_TOKEN, serverUrl } from "configs";

import axiosInstance from "../../axiosInstance";
import { SurveyRegistState, SurveyResponse } from "interfaces/landing";

const fetchUpdateSurveyState = async (
  requestBody: { regist_state: SurveyRegistState },
  response_id: string
) => {
  const token = localStorage.getItem(ACCEESS_TOKEN);

  const result = await axiosInstance.put(
    `${serverUrl}/surveysResponses/${response_id}/state`,
    requestBody,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return result.data;
};

const useUpdateSurveyState = () =>
  useMutation<
    SurveyResponse,
    AxiosError,
    { requestBody: { regist_state: SurveyRegistState }; response_id: string }
  >({
    mutationFn: ({ requestBody, response_id }) =>
      fetchUpdateSurveyState(requestBody, response_id),
  });

export default useUpdateSurveyState;
