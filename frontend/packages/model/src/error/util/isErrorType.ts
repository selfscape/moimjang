import { ErrorType } from "..";

export function isErrorType(value: any): value is ErrorType {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as ErrorType).detail === "string"
  );
}
