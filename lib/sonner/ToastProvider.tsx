"use client";
import { Toaster } from "sonner";
import { useMediaQuery } from "react-responsive";

export default function ToastProvider() {
  // 화면 폭 768px 이하를 모바일로 간주
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  return (
    <Toaster
      key={isMobile ? "mobile" : "desktop"}
      position="top-right"
      toastOptions={{
        style: {
          width: isMobile ? "180px" : "",
        },
      }}
      duration={1500}
      richColors
    />
  );
}
