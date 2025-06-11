import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { User } from "interfaces/user";

import axios from "axios";
import { OWNER, serverUrl } from "configs";
import useOwnerCookie, { getCookie } from "./useOwnerCookie";

export interface SignUpInput {
  username: string;
  email: string;
  password: string;
  gender: string;
  birth_year: number;
  mbti: string;
  keywords: string;
  favorite_media: string;
  tmi: string;
  hobby: string;
  strength: string;
  happyMoment: string;
}

export const signUp = async (userData: SignUpInput): Promise<User> => {
  const owner = getCookie(OWNER);

  const result = await axios.post(`${serverUrl}/auth/signup`, userData, {
    headers: {
      owner,
    },
  });

  return result.data;
};

const useSignUp = () => {
  return useMutation<User, AxiosError, SignUpInput>({
    mutationFn: signUp,
  });
};

export default useSignUp;
