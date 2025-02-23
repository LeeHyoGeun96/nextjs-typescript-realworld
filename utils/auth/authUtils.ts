"use client";

import { API_ENDPOINTS } from "@/constant/api";
import { mutate } from "swr";
import { useAuthStore } from "@/lib/zustand/authStore";

export default async function logout() {
  const token = useAuthStore.getState().token;

  clearAuthState(token);

  // 홈으로 리다이렉트
  window.location.href = "/";
}

export async function clearAuthState(token: string | null) {
  useAuthStore.getState().clear();

  if (token) {
    await mutate([API_ENDPOINTS.CURRENT_USER, token], null, false);
  }
}
