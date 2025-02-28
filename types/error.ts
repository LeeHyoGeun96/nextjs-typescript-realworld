export interface ValidationError extends Error {
  name: "ValidationError";
  fieldErrors: Record<string, string>;
}

export interface DisplayError {
  name: "DisplayError";
  errorCode?: number;
  message: string;
  cause?: Error;
}

export function createDisplayError(
  error: unknown,
  code?: number
): DisplayError {
  if (error instanceof Error) {
    return {
      name: "DisplayError",
      message: error.message,
      errorCode: code,
      cause: error, // 원본 에러 저장
    };
  }

  if (typeof error === "string") {
    return {
      message: error,
      name: "DisplayError",
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

export type ApiError = Error | ValidationError | DisplayError;

// 개별 에러 메시지 타입
export type ErrorMessage = string[];
