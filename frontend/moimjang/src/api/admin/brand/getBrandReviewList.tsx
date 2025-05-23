import { ACCEESS_TOKEN, serverUrl } from "configs";
import axiosInstance from "../axiosInstance";

interface ImageObject {
  url: string;
  altText?: string;
}

export interface Output {
  id: number;
  brandId: number;
  userId: number;
  contents: string;
  imageUrlList: ImageObject[]; // 여러 이미지 객체를 담는 배열입니다.
  isDisplay: boolean;
}

export interface Params {
  brandId: number;
  isDisplay: boolean;
}

export const getBrandReviewList = async (
  params: Params
): Promise<Array<Output>> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);
  const response = await axiosInstance.get(`${serverUrl}/brands/reviewlist`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  });

  return response.data;
};
