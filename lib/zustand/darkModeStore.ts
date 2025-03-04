"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DarkModeState {
  isDark: boolean;
  toggle: () => void;
  setDark: (isDark: boolean) => void;
}

// 안전하게 시스템 다크 모드 확인하는 함수
const getSystemPreference = () => {
  if (typeof window !== "undefined") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  return false; // 서버 측에서는 기본값 반환
};

const useDarkModeStore = create<DarkModeState>()(
  persist(
    (set, get) => {
      // 초기 상태 설정시 window 객체 체크
      const initialIsDark =
        typeof window !== "undefined"
          ? localStorage.getItem("theme") === "dark" ||
            (localStorage.getItem("theme") === null && getSystemPreference())
          : false;

      // 초기 상태 설정
      if (typeof window !== "undefined" && initialIsDark) {
        document.documentElement.classList.add("dark");
      }

      return {
        isDark: initialIsDark,
        toggle: () => {
          const newIsDark = !get().isDark;
          set({ isDark: newIsDark });

          if (newIsDark) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
          } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
          }
        },
        setDark: (isDark: boolean) => {
          if (isDark) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
          } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
          }
          set({ isDark });
        },
      };
    },
    {
      name: "dark-mode-storage",
      partialize: (state) => ({ isDark: state.isDark }),
      skipHydration: true, // 하이드레이션 건너뛰기 옵션 추가
    }
  )
);

export default useDarkModeStore;
