import axios from "axios";
import { ACCEESS_TOKEN, serverUrl } from "configs";
import axiosInstance from "../axiosInstance";
import { User } from "interfaces/user";

export interface EditProfileInput {
  username: string;
  email: string;
  password: string;
  gender: string;
  birth_year: number;
  mbti: string;
  keyword: string;
  hobby?: string;
  bestMedia: string;
  strength: string;
  happyMoment: string;
  tmi: string;
}

export const editUser = async (
  profileData: EditProfileInput
): Promise<User> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);

  const response = await axiosInstance.put(
    `${serverUrl}/customers/my_info`,
    profileData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
