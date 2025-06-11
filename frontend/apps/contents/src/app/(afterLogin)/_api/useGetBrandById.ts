import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GET_BRAND_BY_ID } from "@/app/_constant/queryKeys";
import { ACCEESS_TOKEN } from "@constants/auth";
import { serverUrl } from "@/app/_constant/config";
import { Image } from "@model/common/index";

export interface Response {
  title: string;
  description: string;
  min_participants: number;
  max_participants: number;
  meeting_location: string;
  location_link: string;
  brand_state: string;
  id: number;
  thumbnailImage: Image;
  detailImages: Array<Image>;
}

export const getBrandById = async (
  brand_id: number | null,
  owner: string | null,
  token: string | null
): Promise<Response> => {
  const result = await fetch(`${serverUrl}/customers/brand/${brand_id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Owner: owner || "",
    },
    next: {
      tags: [GET_BRAND_BY_ID],
    },
    cache: "no-store",
  });
  if (!result.ok) new Error("Failed to fetch data");

  return result.json();
};

const useGetBrandById = (brand_id: number, owner: string) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem(ACCEESS_TOKEN);
    setToken(token);
  }, []);

  return useQuery<Response, Error>({
    queryKey: [GET_BRAND_BY_ID, brand_id, owner],
    queryFn: () => getBrandById(brand_id, owner, token),
    staleTime: 60 * 1000,
    enabled: Boolean(owner) && Boolean(token) && Boolean(brand_id),
  });
};

export default useGetBrandById;
