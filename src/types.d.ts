import { PomodoroMode } from "./enums";

interface Settings {
  work: number;
  break: number;
  longBreak: number;
  alarm: string;
  volume: number;
}

export interface User {
  name: string;
  settings: Settings;
}

// interface Times {
//   work: number;
//   break: number;
//   longBreak: number;
// }

export interface Pomodoro {
  isActive: boolean;
  timeLeft: number;
  timePassed: number;
  totalTime: number;
  mode: PomodoroMode;
  round: number;
  // times: Times;
}
