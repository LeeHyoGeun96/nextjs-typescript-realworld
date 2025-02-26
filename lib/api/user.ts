import { API_ENDPOINTS } from "@/constant/api";

export const fetchCurrentUser = async () => {
  try {
    const response = await fetch(API_ENDPOINTS.CURRENT_USER, {
      method: "GET",
      credentials: "include", // 쿠키 포함
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 401) {
        // 인증 오류 처리
        return { user: null };
      }
      // 기타 오류 처리
      return { user: null };
    }

    return response.json();
  } catch (error) {
    console.error("Failed to fetch current user:", error);
    return { user: null };
  }
};
