import { ACCEESS_TOKEN, OWNER, serverUrl } from "configs";
import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import axiosInstance from "api/admin/axiosInstance";
import { GET_MAIN_IMAGE } from "constants/landing/queryKeys";

export const fetchGetMainImage = async (): Promise<{
  id: number;
  url: string;
}> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);
  const owner = localStorage.getItem(OWNER);

  const response = await axiosInstance.get(
    `${serverUrl}/landingAdmin/mainImage`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        owner,
      },
    }
  );
  return response.data;
};

const useGetMainImage = () =>
  useQuery<{ id: number; url: string }, AxiosError>({
    queryKey: [GET_MAIN_IMAGE],
    queryFn: fetchGetMainImage,
  });

export default useGetMainImage;
