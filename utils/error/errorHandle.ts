// utils/errorHandlers.ts
import { ApiError } from "@/types/error";
import { toast } from "sonner";

const ERROR_NAME = "ApiResponseError";

export class ApiResponseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = ERROR_NAME;
  }
}

export const isApiResponseError = (
  error: unknown
): error is ApiResponseError => {
  return error instanceof ApiResponseError && error.name === ERROR_NAME;
};

export const handleApiError = <T extends { error?: ApiError }>(
  response: T,
  defaultMessage: string,
  setError?: (message: string) => void
) => {
  if (response.error) {
    const errorMessage = response.error?.message || defaultMessage;

    if (setError) {
      setError(errorMessage);
    } else {
      toast.error(errorMessage);
    }
    const apiError = new ApiResponseError(errorMessage);
    throw apiError;
  }
  return response;
};

export const handleUnexpectedError = (
  error: unknown,
  operation: string,
  setUnExpectedError?: (message: string) => void
) => {
  if (isApiResponseError(error)) {
    throw error;
  }

  const message =
    error instanceof Error
      ? error.message
      : `예상치 못한 에러로 ${operation}에 실패했습니다.`;

  if (setUnExpectedError) {
    setUnExpectedError(message);
  }

  throw error;
};
