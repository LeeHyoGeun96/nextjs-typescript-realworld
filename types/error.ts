import formatError from "@/error/convertUserErrorToKorean";

export interface ValidationError extends Error {
  name: "ValidationError";
  fieldErrors: Record<string, string>;
}

export interface DisplayError {
  name: "DisplayError";
  errorCode?: number;
  message: string;
}

type ServerError = Record<string, string[]> | undefined;

function isServerError(error: unknown): error is ServerError {
  return (
    typeof error === "object" &&
    error !== null &&
    Object.values(error as object).every(Array.isArray)
  );
}

export function createDisplayError(
  error: unknown,
  code?: number
): DisplayError {
  if (error instanceof Error) {
    return {
      message: error.message,
      name: "DisplayError",
      errorCode: code,
    };
  }

  if (typeof error === "string") {
    return {
      message: error,
      name: "DisplayError",
    };
  }

  if (isServerError(error)) {
    return {
      message: JSON.stringify(formatError(error), null, 2),
      name: "DisplayError",
      errorCode: code,
    };
  }

  return {
    message: "알 수 없는 에러가 발생했습니다",
    name: "DisplayError",
  };
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

export interface UnexpectedError extends Error {
  name: "UnexpectedError";
  message: string;
}

export function isUnexpectedError(error: unknown): error is UnexpectedError {
  return (
    error !== null &&
    typeof error === "object" &&
    "name" in error &&
    error.name === "UnexpectedError"
  );
}

export type ApiError = Error | ValidationError | DisplayError | UnexpectedError;

export function isApiError(error: unknown): error is ApiError {
  return (
    isValidationError(error) ||
    isDisplayError(error) ||
    isUnexpectedError(error)
  );
}

// 개별 에러 메시지 타입
export type ErrorMessage = string[];

// 에러 객체 타입
