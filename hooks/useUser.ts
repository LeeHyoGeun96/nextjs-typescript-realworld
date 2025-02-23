"use client";

import useSWR from "swr";
import { API_ENDPOINTS } from "@/constant/api";
import { fetchCurrentUser } from "@/utils/auth/user";
import { useAuthStore } from "@/lib/zustand/authStore";

export const useUser = () => {
  const token = useAuthStore((state) => state.token);

  const { data, error, isLoading, mutate } = useSWR(
    token ? [API_ENDPOINTS.CURRENT_USER, token] : null,
    fetchCurrentUser,
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
    }
  );
  console.log(data);
  const user = data?.user;

  return {
    user,
    error,
    isLoggedIn: !!user,
    isLoading,
    mutate,
  };
};
