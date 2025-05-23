import { ACCEESS_TOKEN, serverUrl } from "configs";
import axiosInstance from "api/consumer/axiosInstance";

export interface GetBrandByIdOutput {
  title: string;
  description: string;
  min_participants: number;
  max_participants: number;
  meeting_location: string;
  location_link: string;
  brand_state: string;
  id: number;
  thumbnailImage: {
    id: number;
    url: string;
  };
  detailImages: {
    id: number;
    url: string;
  }[];
}

export const getBrandById = async (
  brand_id: number
): Promise<GetBrandByIdOutput> => {
  const token = localStorage.getItem(ACCEESS_TOKEN);

  const response = await axiosInstance.get(
    `${serverUrl}/customers/brand/${brand_id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
