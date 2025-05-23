import {
  QueryObserverResult,
  RefetchOptions,
  UseMutateFunction,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { User } from "interfaces/user";
import { createContext, useContext } from "react";

export const UserTableContext = createContext(null);

const useUserTable = () => {
  const context = useContext<{
    filter: { limit: number; isDescending: boolean };
    setFilter: React.Dispatch<
      React.SetStateAction<{
        limit: number;
        isDescending: boolean;
      }>
    >;
    refetchUser: (
      options?: RefetchOptions
    ) => Promise<QueryObserverResult<Array<User>, AxiosError>>;
    deleteUser: UseMutateFunction<
      void,
      AxiosError<unknown, any>,
      string,
      unknown
    >;
    userList: Array<User>;
    totalItems: number;
  }>(UserTableContext);
  if (!context) {
    throw new Error("useUserTable must be used within a UserTableProvider");
  }
  return context;
};

export default useUserTable;
