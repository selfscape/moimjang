import axios from "axios";
import { ACCEESS_TOKEN, serverUrl } from "configs";
import { User } from "interfaces/user";
import axiosInstance from "api/consumer/axiosInstance";

export interface UpdateMyInfoRequestBody {
  usernames: string;
  emails: string;
  passwords: string;
  genders: string;
  birth_years: number;
  mbtis: string;
  keywordss: string;
  favorite_medias: string;
  tmis: string;
  hobbys: string;
  strengths: string;
  happyMoments: string;
}

export const updateMyInfo = async (
  requestBody: UpdateMyInfoRequestBody
): Promise<User> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);

  const response = await axiosInstance.put(
    `${serverUrl}/customers/my_info`,
    requestBody,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
