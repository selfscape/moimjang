import { ACCEESS_TOKEN } from "@constants/auth";
import { serverUrl } from "@constants/config";

export interface Response {
  imageUrl: string;
  imagePath: string;
}

export const uploadBrandReviewImage = async (
  file: File,
  brand_review_id: number
): Promise<Response> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("brand_review_id", String(brand_review_id));

  const token = localStorage.getItem(ACCEESS_TOKEN);

  const result = await fetch(
    `${serverUrl}/customers/brandReviews/uploadImage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token ?? ""}`,
      },
      body: formData,
      cache: "no-cache",
    }
  );
  if (!result.ok) {
    throw new Error("Failed to create brand review");
  }

  return result.json();
};
