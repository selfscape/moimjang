import { axiosInstance } from "..";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { OWNER, serverUrl } from "configs";

import { GET_MAIN_IMAGE } from "constants/landing/queryKeys";

interface Output {
  id: number;
  url: string;
}

export const fetchGetMainImage = async (): Promise<Output> => {
  const owner = localStorage.getItem(OWNER);

  const response = await axiosInstance.get(`${serverUrl}/landing/mainImage`, {
    headers: {
      owner,
    },
  });

  return response.data;
};

const useGetMainImage = () =>
  useQuery<Output, AxiosError>({
    queryKey: [GET_MAIN_IMAGE],
    queryFn: fetchGetMainImage,
  });

export default useGetMainImage;
