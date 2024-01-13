import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type User } from "../types";

interface State {
  user?: User;
  setDefaultUser: (name: string) => void;
  setUser: (
    name: string,
    workTime: number,
    breakTime: number,
    longbreakTime: number,
    alarm: string,
    volume: number,
  ) => void;
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
                work: 25,
                break: 5,
                longBreak: 10,
                alarm: "bell",
                volume: 0.5,
              },
            },
          });
        },
        setUser: (
          name: string,
          workTime: number,
          breakTime: number,
          longbreakTime: number,
          alarm: string,
          volume: number,
        ) => {
          const user = get().user;

          const newName = name !== "" ? name : user?.name;
          const newUser = {
            name: newName,
            settings: {
              work: workTime,
              break: breakTime,
              longBreak: longbreakTime,
              alarm,
              volume,
            },
          } as User;
          set({ user: newUser });
        },
        deleteUser: () => {
          set({ user: undefined });
        },
      };
    },
    { name: "user" },
  ),
);
