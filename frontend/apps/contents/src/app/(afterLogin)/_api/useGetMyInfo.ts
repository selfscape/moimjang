import { useQuery } from "@tanstack/react-query";
import { GET_MY_INFO } from "@/app/_constant/queryKeys";
import { useState, useEffect } from "react";
import { User } from "@model/user";
import { ACCEESS_TOKEN } from "@constants/auth";
import { serverUrl } from "@constants/config";

export const getMyInfo = async (token: string | null): Promise<User> => {
  const result = await fetch(`${serverUrl}/customers/my_info`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  if (!result.ok) throw new Error("Failed to fetch data");
  return result.json();
};

const useGetMyInfo = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem(ACCEESS_TOKEN);
    setToken(token);
  }, []);

  return useQuery<User, Error>({
    queryKey: [GET_MY_INFO],
    queryFn: () => getMyInfo(token),
    enabled: Boolean(token),
  });
};

export default useGetMyInfo;
