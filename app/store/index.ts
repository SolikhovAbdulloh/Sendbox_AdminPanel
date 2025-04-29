import { create } from "zustand";

interface UserState {
  avatar: string;
  setAvatar: (url: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  avatar: "/admin-avatar.jpg", 
  setAvatar: (url) => set({ avatar: url }),
}));
