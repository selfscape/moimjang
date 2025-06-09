import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { ACCEESS_TOKEN } from "@constants/auth";
// import { serverUrl } from "@/app/_constant/config";
import { User } from "@model/user";
import { serverUrl } from "@/app/_constant/config";

export interface Response {
  access_token: string;
  token_type: string;
  user: User;
}

export const login = async (
  username: string,
  password: string,
  owner: string | null,
  token: string | null
): Promise<Response> => {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  const response = await fetch(`${serverUrl}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(owner ? { Owner: owner } : {}),
    },
    body: formData.toString(),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  return (await response.json()) as Response;
};

interface LoginVariables {
  username: string;
  password: string;
}

const useLogin = (owner: string | null) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(ACCEESS_TOKEN);
    setToken(stored);
  }, []);

  return useMutation<Response, Error, LoginVariables>({
    mutationFn: ({ username, password }) =>
      login(username, password, owner, token),
    onSuccess: (data) => {
      localStorage.setItem(ACCEESS_TOKEN, data.access_token);
    },
  });
};

export default useLogin;
