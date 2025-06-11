import { ACCEESS_TOKEN, serverUrl } from "configs";
import axiosInstance from "../axiosInstance";
import { BrandState } from "interfaces/brand";

export interface EditBrandOutput {
  id: number;
  title: string;
  description: string;
  thumbnailImageUrl: string;
}

export interface Input {
  title: string;
  description: string;
  min_participants: number;
  max_participants: number;
  meeting_location: string;
  location_link: string | null;
  brand_state: BrandState;
}

export const editBrand = async (
  requestBody: Input,
  brand_id: string
): Promise<EditBrandOutput> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);

  const result = await axiosInstance.put(
    `${serverUrl}/brands/${brand_id}`,
    requestBody,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return result.data;
};
