import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type Pomodoro } from "../types";
import { PomodoroMode } from "../enums";

interface State {
  pomodoro: Pomodoro;
  initPomodoro: (mode: PomodoroMode, time: number) => void;
  setActive: (isActive: boolean) => void;
  setTime: () => void;
  setRound: () => void;
  setDefaultPomodoro: (time: number) => void;
}

export const usePomodoroStore = create<State>()(
  persist(
    (set, get) => {
      return {
        pomodoro: {
          isActive: false,
          timeLeft: 0,
          timePassed: 0,
          totalTime: 0,
          mode: PomodoroMode.WORK,
          round: 1,
        },
        initPomodoro: (mode: PomodoroMode, time: number) => {
          const pomodoro = get().pomodoro;
          const seconds = time * 60;
          set({
            pomodoro: {
              ...pomodoro,
              timeLeft: seconds,
              timePassed: 0,
              totalTime: seconds,
              mode,
            },
          });
        },
        setActive: (isActive: boolean) => {
          const pomodoro = get().pomodoro;
          if (pomodoro) {
            set({
              pomodoro: {
                ...pomodoro,
                isActive,
              },
            });
          }
        },
        setTime: () => {
          const pomodoro = get().pomodoro;
          set({
            pomodoro: {
              ...pomodoro,
              timeLeft: pomodoro.timeLeft - 1,
              timePassed: pomodoro.timePassed + 1,
            },
          });
        },
        setRound: () => {
          const pomodoro = get().pomodoro;
          set({
            pomodoro: {
              ...pomodoro,
              round: pomodoro.round + 1,
            },
          });
        },
        setDefaultPomodoro: (time: number) => {
          const seconds = time * 60;
          set({
            pomodoro: {
              isActive: false,
              timeLeft: seconds,
              timePassed: 0,
              totalTime: seconds,
              mode: PomodoroMode.WORK,
              round: 1,
            },
          });
        },
      };
    },
    { name: "pomodoro" },
  ),
);
