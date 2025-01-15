import {create} from 'zustand';
import {persist} from 'zustand/middleware';

interface DarkModeState {
  isDark: boolean;
  toggle: () => void;
  setDark: (isDark: boolean) => void;
}

const useDarkModeStore = create<DarkModeState>()(
  persist(
    (set, get) => {
      // 초기 상태 설정
      const systemPrefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches;
      const initialIsDark =
        localStorage.theme === 'dark' ||
        (!('theme' in localStorage) && systemPrefersDark);

      // 초기 다크모드 클래스 설정
      if (initialIsDark) {
        document.documentElement.classList.add('dark');
      }

      return {
        isDark: initialIsDark,
        toggle: () => {
          const currentState = get();
          const newIsDark = !currentState.isDark;
          if (newIsDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
          } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
          }
          set({isDark: newIsDark});
        },
        setDark: (isDark: boolean) => {
          if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
          } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
          }
          set({isDark});
        },
      };
    },
    {
      name: 'dark-mode-storage',
      partialize: (state) => ({isDark: state.isDark}),
    },
  ),
);

export default useDarkModeStore;
