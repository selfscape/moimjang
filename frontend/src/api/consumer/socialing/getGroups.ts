import { ACCEESS_TOKEN, serverUrl } from "configs";
import { Group } from "interfaces/group";
import axiosInstance from "api/consumer/axiosInstance";

export const getGroups = async (channel_id: string): Promise<Array<Group>> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);

  const response = await axiosInstance.get(
    `${serverUrl}/customers/groups?channel_id=${channel_id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        channel_id,
      },
    }
  );

  return response.data;
};
