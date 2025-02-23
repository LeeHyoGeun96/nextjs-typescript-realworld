"use client";

import { handleAuthError } from "@/utils/auth/handleAuthError";

export const fetchCurrentUser = async () => {
  const authStorage =
    typeof window !== "undefined" ? localStorage.getItem("auth-storage") : null;

  if (!authStorage) return null;
  const token = JSON.parse(authStorage).state.token;

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      handleAuthError();
    }
    return null;
  }
  return response.json();
};
