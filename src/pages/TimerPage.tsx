import { useEffect, useState } from "react";
import { usePomodoroStore } from "../store/pomodoro";
import { PomodoroMode } from "../enums";
import { useUserStore } from "../store/user";

export default function () {
  const user = useUserStore((state) => state.user);
  const pomodoro = usePomodoroStore((state) => state.pomodoro);
  const setActive = usePomodoroStore((state) => state.setActive);
  const initPomodoro = usePomodoroStore((state) => state.initPomodoro);
  const setTime = usePomodoroStore((state) => state.setTime);
  const setRound = usePomodoroStore((state) => state.setRound);
  const setDefaultPomodoro = usePomodoroStore(
    (state) => state.setDefaultPomodoro,
  );

  const [completeTime, setCompleteTime] = useState(false);

  useEffect(() => {
    const changeMode = () => {
      if (!user || !pomodoro.isActive) return;
      const longBreakRound = 4;
      const finishRound = 8;

      if (
        pomodoro.round === finishRound &&
        pomodoro.mode === PomodoroMode.WORK
      ) {
        const time = user.settings.work;
        setDefaultPomodoro(time);
        setCompleteTime(false);
        return;
      }

      if (
        pomodoro.mode === PomodoroMode.WORK &&
        pomodoro.round % longBreakRound === 0
      ) {
        const time = user.settings.longBreak;
        initPomodoro(PomodoroMode.LONG_BREAK, time);
        setCompleteTime(false);
        return;
      }

      if (pomodoro.mode === PomodoroMode.WORK) {
        const time = user.settings.break;
        initPomodoro(PomodoroMode.BREAK, time);
        setCompleteTime(false);
      } else if (
        pomodoro.mode === PomodoroMode.BREAK ||
        pomodoro.mode === PomodoroMode.LONG_BREAK
      ) {
        const time = user.settings.work;
        initPomodoro(PomodoroMode.WORK, time);
        setRound();
        setCompleteTime(false);
      }
    };

    if (completeTime) changeMode();

    let timeLeft = pomodoro.timeLeft || 0;
    const interval = setInterval(() => {
      timeLeft -= 1;
      if (timeLeft <= 0) {
        setCompleteTime(true);
        return;
      }
      if (pomodoro.isActive) setTime();
    }, 1000);

    return () => clearInterval(interval);
  }, [completeTime, pomodoro.isActive]);

  const handleStop = () => {
    setActive(!pomodoro.isActive);
  };

  const handleReset = () => {
    if (!user) return;
    setDefaultPomodoro(user.settings.work);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const restSeconds = seconds % 60;

    const formatedMinutes = String(minutes).padStart(2, "0");
    const formatedSeconds = String(restSeconds).padStart(2, "0");

    return `${formatedMinutes}:${formatedSeconds}`;
  };

  return (
    <>
      <h1>Run pomodoro</h1>
      <button onClick={handleStop}>
        {pomodoro?.isActive ? "Stop" : "Start"}
      </button>
      <button onClick={handleReset}>Reset</button>
      <p>{pomodoro.mode}</p>
      <p>{pomodoro.round}</p>
      <p>{formatTime(pomodoro.timeLeft)}</p>
    </>
  );
}
