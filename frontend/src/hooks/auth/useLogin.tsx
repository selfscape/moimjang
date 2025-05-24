import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ACCEESS_TOKEN, serverUrl, USER_EMAIL, USER_ROLE } from "configs";
import { User } from "interfaces/user";

export interface LoginOutput {
  access_token: string;
  token_type: string;
  user: User;
}

export const login = async (
  username: string,
  password: string
): Promise<LoginOutput> => {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  const response = await axios.post(`${serverUrl}/auth/login`, formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return response.data;
};

interface LoginVariables {
  username: string;
  password: string;
}

const useLogin = () => {
  return useMutation<LoginOutput, AxiosError, LoginVariables>({
    mutationFn: ({ username, password }) => login(username, password),
    onSuccess: (data) => {
      localStorage.setItem(ACCEESS_TOKEN, data.access_token);
    },
  });
};

export default useLogin;
