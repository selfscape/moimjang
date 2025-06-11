import { QueryClient, useMutation } from "@tanstack/react-query";
import { GET_SERACH_GROUPS } from "constants/queryKeys";
import { Group } from "interfaces/group";
import { ACCEESS_TOKEN, serverUrl, USER_NAME } from "configs";
import axiosInstance from "api/axiosInstance";

export interface CreateGroupInput {
  channel_id: number;
  group_name: string;
}

export const createGroup = async (
  requestBody: CreateGroupInput
): Promise<Group> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);
  const owner = localStorage.getItem(USER_NAME);

  const response = await axiosInstance.post(
    `${serverUrl}/groups`,
    requestBody,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        owner,
      },
    }
  );

  return response.data;
};

const useCreateGroup = () => {
  const queryClient = new QueryClient();

  return useMutation<Group, Error, CreateGroupInput>({
    mutationFn: createGroup,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [GET_SERACH_GROUPS] }),
  });
};

export default useCreateGroup;
