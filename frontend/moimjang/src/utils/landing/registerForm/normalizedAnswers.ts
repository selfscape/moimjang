import { uploadSurveyImage } from "../../../api/landing/uploadSurveyImage";

export async function normalizeAnswers(
  answers: Record<string, any>
): Promise<Array<Record<string, string>>> {
  const normalized: Array<Record<string, string>> = [];

  for (const [key, answerVal] of Object.entries(answers)) {
    let answerValue: string;

    if (answerVal instanceof File) {
      try {
        const uploadResult = await uploadSurveyImage(answerVal);
        answerValue = uploadResult.imageUrl;
      } catch (error) {
        console.error(`Error uploading image for key ${key}:`, error);
        answerValue = "uploadError";
      }
    } else if (typeof answerVal === "string") {
      answerValue = answerVal;
    } else {
      answerValue = JSON.stringify(answerVal);
    }

    normalized.push({
      questionId: key,
      answerValue,
    });
  }

  return normalized;
}
