import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { User } from "@model/user";
import { ACCEESS_TOKEN } from "@constants/auth";
import { serverUrl } from "@constants/config";

export interface RequestBody extends User {
  password: string;
}

const editProfile = async (
  requestBody: User,
  token: string | null
): Promise<User> => {
  const response = await fetch(`${serverUrl}/customers/my_info`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(requestBody),
    cache: "no-cache",
  });

  if (!response.ok) {
    throw new Error("Failed to update user profile");
  }
  return response.json();
};

const useEditProfile = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem(ACCEESS_TOKEN));
  }, []);

  return useMutation<User, Error, { requestBody: User }>({
    mutationFn: ({ requestBody }) => editProfile(requestBody, token),
  });
};

export default useEditProfile;
