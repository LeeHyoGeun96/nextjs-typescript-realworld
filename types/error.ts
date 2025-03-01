export interface ValidationError extends Error {
  name: "ValidationError";
  fieldErrors: Record<string, string>;
}

export function isValidationError(error: unknown): error is ValidationError {
  return (
    error !== null &&
    typeof error === "object" &&
    "name" in error &&
    error.name === "ValidationError"
  );
}

export function isDisplayError(error: unknown): error is DisplayError {
  if (error === undefined) {
    return false;
  }

  return (
    error !== null &&
    typeof error === "object" &&
    "name" in error &&
    error.name === "DisplayError"
  );
}

export type ApiError = Error | ValidationError | DisplayError;

// 개별 에러 메시지 타입
export type ErrorMessage = string[];
