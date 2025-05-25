import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { createSurvey, Output, RequestBody } from "api/landing/createSurvey";

const useRegistForm = () => {
  return useMutation<
    Output,
    AxiosError,
    {
      requestBody: RequestBody;
      survey_id: string;
    }
  >({
    mutationFn: ({ requestBody, survey_id }) =>
      createSurvey(requestBody, survey_id),
  });
};

export default useRegistForm;
