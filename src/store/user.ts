import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type User } from "../types";

interface State {
  user?: User;
  setDefaultUser: (name: string) => void;
  setUser: (user: User) => void;
  deleteUser: () => void;
}

export const useUserStore = create<State>()(
  persist(
    (set, get) => {
      return {
        user: undefined,
        setDefaultUser: (name: string) => {
          set({
            user: {
              name,
              settings: {
                work: 1,
                break: 1,
                longBreak: 1,
                alarm: "bell",
                volume: 0.5,
              },
            },
          });
        },
        setUser: (user: User) => {
          set({ user });
        },
        deleteUser: () => {
          set({ user: undefined });
        },
      };
    },
    { name: "user" },
  ),
);
