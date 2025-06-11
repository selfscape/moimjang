import { useMutation } from "@tanstack/react-query";
import useCookie from "@util/hooks/useCookie";
import { USER_NAME } from "@constants/auth";
import { serverUrl } from "@/app/_constant/config";

export interface RequestBody {
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

export const signup = async (
  requestBody: RequestBody,
  owner: string
): Promise<Response> => {
  const response = await fetch(`${serverUrl}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Owner: owner,
    },
    body: JSON.stringify(requestBody),
    cache: "no-cache",
  });

  if (!response.ok) {
    throw new Error("Failed to signup");
  }

  const result = await response.json();

  return result;
};

const useSignup = () => {
  const owner = useCookie(OWNER);

  return useMutation<Response, Error, RequestBody>({
    mutationFn: (requestBody) => signup(requestBody, owner),
  });
};

export default useSignup;
