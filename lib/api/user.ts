import { API_ENDPOINTS } from "@/constant/api";

export const fetchCurrentUser = async () => {
  const response = await fetch(API_ENDPOINTS.CURRENT_USER, {
    method: "GET",
    credentials: "include", // 쿠키 포함
    cache: "no-store",
  });

  if (!response.ok) {
    if (response.status === 401) {
    }
    return null;
  }
  return response.json();
};
