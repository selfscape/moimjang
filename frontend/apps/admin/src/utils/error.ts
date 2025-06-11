import { AxiosError } from "axios";

export const alertErrorMessage = (error: AxiosError) => {
  const errorMessage = error?.response?.data as { detail: string };
  alert(errorMessage?.detail);
};
