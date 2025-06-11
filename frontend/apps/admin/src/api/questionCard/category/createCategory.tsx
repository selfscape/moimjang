import { ACCEESS_TOKEN, serverUrl } from "configs";
import axiosInstance from "../../axiosInstance";

export interface CreateCategoryOutput {
  id: number;
  name: string;
  isDeckVisible: boolean;
  coverImage: { id: number; url: string };
}

export interface ReqeustBody {
  name: string;
  isDeckVisible: boolean;
}

export const createCategory = async (
  requestBody: ReqeustBody
): Promise<CreateCategoryOutput> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);

  const result = await axiosInstance.post(
    `${serverUrl}/questionCardCategoris`,
    requestBody,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return result.data;
};
