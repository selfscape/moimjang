import { Survey } from "@model/form";

export function isSurveyArray(value: any): value is Array<Survey> {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    Array.isArray(value[0].questions)
  );
}

export function isAnswered(value: unknown): boolean {
  if (value == null) return false;
  if (typeof value === "string") return value.trim() !== "";
  if (Array.isArray(value)) return value.length > 0;
  return true;
}
