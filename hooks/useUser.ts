"use client";

import useSWR from "swr";
import { API_ENDPOINTS } from "@/constant/api";
import { fetchCurrentUser } from "@/lib/api/user";

export const useUser = () => {
  const { data, error, isLoading, mutate } = useSWR(
    API_ENDPOINTS.CURRENT_USER,
    fetchCurrentUser,
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
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
