"use client";

import { CurrentUserType } from "@/types/authTypes";
import { fetcher } from "./fetcher";
import { SWRConfig } from "swr";
import { API_ENDPOINTS } from "@/constant/api";

// API 응답 타입들을 모아둔 타입
type ApiResponse = {
  [API_ENDPOINTS.CURRENT_USER]: CurrentUserType | null;
  // 다른 API 엔드포인트의 응답 타입 추가
  // [API_ENDPOINTS.POSTS]: Post[];
  // [API_ENDPOINTS.COMMENTS]: Comment[];
};

interface FallbackData {
  [key: string]: ApiResponse[keyof ApiResponse]; // 모든 가능한 응답 타입
}

export function SWRProvider({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback: Partial<FallbackData>;
}) {
  return (
    <SWRConfig
      value={{
        fetcher,
        fallback,
        revalidateOnFocus: false,
      }}
    >
      {children}
    </SWRConfig>
  );
}
