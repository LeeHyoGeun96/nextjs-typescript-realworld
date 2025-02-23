"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/zustand/authStore";
import { MainLayout } from "@/components/Auth/MainLayout";
import { useUser } from "@/hooks/useUser";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const isLoaded = useAuthStore((state) => state.isLoaded);
  const { user, isLoading, error } = useUser();

  // useEffect를 통해 조건에 맞으면 리다이렉트 처리
  useEffect(() => {
    if (isLoaded) {
      if (!token || error || (!isLoading && !user)) {
        router.push("/login");
      }
    }
  }, [isLoaded, token, error, isLoading, user, router]);

  // 초기화 중이거나 사용자 데이터 로딩 중일 때 fallback UI (공통 레이아웃 사용)
  if (!isLoaded || isLoading) {
    return (
      <MainLayout>
        <div>{!isLoaded ? "Initializing..." : "Loading user data..."}</div>
      </MainLayout>
    );
  }

  return <>{children}</>;
}
