import { ACCEESS_TOKEN, serverUrl } from "configs";
import { Group } from "interfaces/group";
import axiosInstance from "../axiosInstance";

export const getSearchGroups = async (
  channel_id: number
): Promise<Array<Group>> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);
  const response = await axiosInstance.get(
    `${serverUrl}/groups/search?channel_id=${channel_id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
