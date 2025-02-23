"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/zustand/authStore";

export function ClientInitializer({ children }: { children: React.ReactNode }) {
  const setToken = useAuthStore((state) => state.setToken);
  const setIsLoaded = useAuthStore((state) => state.setIsLoaded);

  useEffect(() => {
    const authStorage = localStorage.getItem("auth-storage");
    const token = authStorage ? JSON.parse(authStorage).token : null;

    if (token) {
      setToken(token);
    } else {
      // 토큰이 없더라도 초기화 완료 플래그 설정
      setIsLoaded(true);
    }
  }, [setToken, setIsLoaded]);

  return <>{children}</>;
}
