import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import axiosInstance from "api/admin/axiosInstance";
import { GET_HOST_REGIST_ADMIN } from "constants/admin/queryKeys";
import { ACCEESS_TOKEN, serverUrl } from "configs";
import { HostRegist } from "interfaces/hostRegist";

export interface GetHostRegistsOutput {
  regists: Array<HostRegist>;
  totalCount: number;
}

interface Params {
  sort_by: string;
  descending: boolean;
  offset: number;
  limit: number;
}

export const getHostRegistAdmin = async (
  params: Params
): Promise<GetHostRegistsOutput> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);

  const response = await axiosInstance.get(`${serverUrl}/hostRegistAdmin`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  });

  return response.data;
};

const useGetHostRegistAdmin = (params: Params) =>
  useQuery<GetHostRegistsOutput, AxiosError>({
    queryKey: [GET_HOST_REGIST_ADMIN, params],
    queryFn: () => getHostRegistAdmin(params),
  });

export default useGetHostRegistAdmin;
