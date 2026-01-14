import {create} from "zustand";

export const useThemeStore = create<{
  isDark: boolean;
  toggle: () => void;
}>((set) => ({
  isDark: false,
  toggle: () => set((s) => ({isDark: !s.isDark})),
}));
