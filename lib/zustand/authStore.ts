import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  isLoaded: boolean; // 클라이언트 초기화 완료 여부
  setToken: (token: string) => void;
  setIsLoaded: (loaded: boolean) => void;
  clear: () => void;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      token: null,
      isLoaded: false,
      setToken: (token: string) => set({ token, isLoaded: true }),
      setIsLoaded: (loaded: boolean) => set({ isLoaded: loaded }),
      clear: () => set({ token: null, isLoaded: true }),
    }),
    {
      name: "auth-storage", // 로컬스토리지에 저장될 key 이름
    }
  )
);
