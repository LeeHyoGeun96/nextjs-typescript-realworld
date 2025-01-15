// validationUtils.ts
import { ValidationErrors } from '../types/authTypes';

/**
 * ValidationErrors를 단순 문자열 배열로 변환하는 유틸리티 함수
 * @param errors - 서버에서 받아온 ValidationErrors 객체
 * @returns 가공된 오류 메시지 배열
 */
export const formatValidationErrors = (errors: ValidationErrors): string[] => {
  return Object.entries(errors).flatMap(([field, messages]) =>
    messages.map((msg) => `${field}: ${msg}`),
  );
};
