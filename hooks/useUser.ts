"use client";

import useSWR from "swr";
import { API_ENDPOINTS } from "@/constant/api";

export const useUser = () => {
  const { data, error, isLoading, mutate } = useSWR(
    API_ENDPOINTS.CURRENT_USER,
    {
      revalidateOnFocus: false, // 포커스 시 재검증 비활성화
      revalidateOnReconnect: true, // 네트워크 재연결 시 재검증
      revalidateIfStale: false, // 오래된 데이터 자동 재검증 비활성화
      dedupingInterval: 60000, // 1분 동안 중복 요청 방지
      errorRetryCount: 3, // 에러 시 3번까지 재시도
      errorRetryInterval: 5000, // 재시도 간격 5초
      shouldRetryOnError: false, // 401, 403 등의 에러는 재시도하지 않음
      focusThrottleInterval: 5000, // 포커스 이벤트 쓰로틀링 (5초)
    }
  );

  const user = data?.user;

  return {
    user,
    error,
    isLoggedIn: !!user,
    isLoading,
    mutate,
  };
};
