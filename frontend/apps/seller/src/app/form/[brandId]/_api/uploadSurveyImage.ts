import { serverUrl } from "@/app/_constant/config";

export const uploadSurveyImage = async (file: File, owner: string) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    `${serverUrl}/landing/surveys/form/uploadImage`,
    {
      method: "POST",
      body: formData,
      headers: {
        Owner: owner,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to upload image");
  }

  const result = await response.json();

  return result;
};
