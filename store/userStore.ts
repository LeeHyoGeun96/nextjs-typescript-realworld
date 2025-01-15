import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import {immer} from 'zustand/middleware/immer';

export interface CurrentUserType {
  username: string;
  email: string;
  bio?: string;
  image?: string;
}

interface State {
  isLoggedIn: boolean;
  user?: CurrentUserType;
  token?: string;
}

interface Actions {
  login: (user: CurrentUserType, token: string) => void;
  logout: () => void;
}

const initialState: State = {
  isLoggedIn: false,
  user: undefined,
  token: undefined,
};

export const useUserStore = create<State & Actions>()(
  persist(
    immer((set) => ({
      ...initialState,
      login: (user, token) => set({isLoggedIn: true, user, token}),
      logout: () => set({...initialState}),
    })),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isLoggedIn: state.isLoggedIn,
      }),
    },
  ),
);
