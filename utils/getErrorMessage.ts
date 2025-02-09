import convertAuthSupabaseErrorToKorean from "@/error/convertAuthSupabaseErrorToKorean";
import { ApiError, isAuthError } from "@/types/error";

const getErrorMessage = (error: ApiError) => {
  if (isAuthError(error)) {
    return convertAuthSupabaseErrorToKorean(error.code) || error.message;
  }
  return error?.message || "알 수 없는 오류가 발생했습니다.";
};

export default getErrorMessage;
