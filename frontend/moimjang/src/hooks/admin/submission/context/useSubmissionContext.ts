import { createContext, useContext } from "react";
import { HostRegist } from "interfaces/hostRegist";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { GetHostRegistsOutput } from "api/admin/hostRegist/useGetHostRegistAdmin";
import { AxiosError } from "axios";

interface SubmissionContextType {
  hostRegists: Array<HostRegist>;
  refetch: (
    options?: RefetchOptions
  ) => Promise<
    QueryObserverResult<GetHostRegistsOutput, AxiosError<unknown, any>>
  >;
  error: AxiosError<unknown, any>;
  isLoading: boolean;
  filter: {
    sort_by: string;
    descending: boolean;
    offset: number;
    limit: number;
  };
  setFilter: React.Dispatch<
    React.SetStateAction<{
      sort_by: string;
      descending: boolean;
      offset: number;
      limit: number;
    }>
  >;
}

export const SubmissionContext = createContext<SubmissionContextType>(null);

export const useSubmissionContext = (): SubmissionContextType => {
  const context = useContext(SubmissionContext);

  if (!context) {
    throw new Error(
      "SubmissionContext must be used within a SubmissionProvider"
    );
  }
  return context;
};
