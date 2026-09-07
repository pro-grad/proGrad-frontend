import { create } from 'zustand';

interface AppState {
  sawWelcomeMes: boolean;
  setSawWelcomeMes: (val: boolean) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sawWelcomeMes: false,
  setSawWelcomeMes: (val) => set({ sawWelcomeMes: val }),
  isLoggedIn: false,
  setIsLoggedIn: (val) => set({ isLoggedIn: val }),
}));