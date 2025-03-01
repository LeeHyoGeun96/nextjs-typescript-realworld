"use client";

import useSWR from "swr";
import { API_ENDPOINTS } from "@/constant/api";

export const useUser = () => {
  const { data, error, isLoading, mutate } = useSWR(
    API_ENDPOINTS.CURRENT_USER,
    {
      revalidateOnFocus: false,
      revalidateIfStale: true,
      dedupingInterval: 300000,
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
