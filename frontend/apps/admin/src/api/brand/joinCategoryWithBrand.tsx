import { ACCEESS_TOKEN, serverUrl } from "configs";
import axiosInstance from "../axiosInstance";

export interface JoinCategoryWithBrandOutput {
  brandId: number;
  questionCardCategoryId: number;
}

export const joinCategoryWithBrand = async (
  brand_id: string,
  question_card_category_id: number
): Promise<JoinCategoryWithBrandOutput> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);

  const result = await axiosInstance.post(
    `${serverUrl}/brands/${brand_id}/questionCardCategories/${question_card_category_id}`,
    {}, // 데이터가 필요하지 않다면 빈 객체
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        brand_id,
        question_card_category_id,
      },
    }
  );
  return result.data;
};
