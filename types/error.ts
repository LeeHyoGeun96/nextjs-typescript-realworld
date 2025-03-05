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

export type ApiError = Error | ValidationError | null;

// 개별 에러 메시지 타입
export type ErrorMessage = string[];
