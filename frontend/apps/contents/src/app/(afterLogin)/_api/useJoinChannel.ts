import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { ACCEESS_TOKEN } from "@constants/auth";
import { serverUrl } from "@/app/_constant/config";
import { ApiError, ErrorType } from "@model/error/index";

export const joinChannel = async (
  target_channel_id: number,
  token: string | null
): Promise<void | ErrorType> => {
  const res = await fetch(`${serverUrl}/customers/channel`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ target_channel_id }),
  });

  return res.json();
};

const useJoinChannel = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(ACCEESS_TOKEN);
    setToken(stored);
  }, []);

  return useMutation<void | ErrorType, ApiError, number>({
    mutationFn: (channelId) => joinChannel(channelId, token),
  });
};

export default useJoinChannel;
