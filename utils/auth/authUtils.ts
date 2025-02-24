"use client";

import { API_ENDPOINTS } from "@/constant/api";
import { mutate } from "swr";
import { logout as serverLogout } from "@/actions/auth";
export default async function logout() {
  await mutate(API_ENDPOINTS.CURRENT_USER, null, false);
  await serverLogout();

  // 홈으로 리다이렉트
  window.location.href = "/";
}
