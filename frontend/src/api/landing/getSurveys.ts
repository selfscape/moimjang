import { OWNER, serverUrl } from "configs";
import { axiosInstance } from "api/landing/index";

import { Survey } from "interfaces/landing";

export const getSurveys = async (brand_id: number): Promise<Array<Survey>> => {
  const owner = localStorage.getItem(OWNER);
  const response = await axiosInstance.get(`${serverUrl}/landing/surveys`, {
    params: {
      brand_id,
    },
    headers: {
      owner,
    },
  });

  return response.data;
};
