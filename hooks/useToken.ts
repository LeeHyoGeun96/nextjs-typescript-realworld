"use client";

import { useState, useEffect } from "react";

export function useToken() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // 컴포넌트 초기 마운트 시 토큰을 읽어옵니다.
    setToken(localStorage.getItem("token"));

    // storage 이벤트를 통해 다른 탭 등에서 변경된 경우도 처리합니다.
    const handleStorageChange = () => {
      const newToken = localStorage.getItem("token");
      setToken(newToken);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return token;
}
