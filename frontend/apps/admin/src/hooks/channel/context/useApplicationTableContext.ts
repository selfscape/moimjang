import { AxiosError } from "axios";
import { createContext, useContext } from "react";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";

import { Survey } from "interfaces/brand/survey";
import { SurveyResponse } from "interfaces/landing";
import { GetSurveyResponseOutput } from "../useGetSurveyResponses";

interface ApplicationTableContextType {
  survey: Array<Survey>;
  surveyResponses: Array<SurveyResponse>;
  refetch: (
    options?: RefetchOptions
  ) => Promise<
    QueryObserverResult<GetSurveyResponseOutput, AxiosError<unknown, any>>
  >;
  enlargedImageUrl: string;
  setEnlargedImageUrl: React.Dispatch<React.SetStateAction<string>>;
  filter: {
    limit: number;
    sort_by: string;
    isDescending: boolean;
  };
  setFilter: React.Dispatch<
    React.SetStateAction<{
      limit: number;
      sort_by: string;
      isDescending: boolean;
    }>
  >;
}

export const ApplicationTableContext =
  createContext<ApplicationTableContextType>(null);

export const useApplicationTableContext = (): ApplicationTableContextType => {
  const context = useContext(ApplicationTableContext);

  if (!context) {
    throw new Error(
      "ApplicationTableContext must be used within a BrandProvider"
    );
  }
  return context;
};
