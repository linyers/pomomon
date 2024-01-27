import { useEffect, useMemo, useRef, useState } from "react";
import { useUserStore } from "../store/user";
import { usePomodoroStore } from "../store/pomodoro";
import { PomodoroMode } from "../enums";
import bellSound from "../assets/bell.mp3";
import noooSound from "../assets/nooo.mp3";

export default function Timer() {
  const user = useUserStore((state) => state.user);
  const initPomodoro = usePomodoroStore((state) => state.initPomodoro);
  const setTime = usePomodoroStore((state) => state.setTime);
  const setRound = usePomodoroStore((state) => state.setRound);
  const pomodoro = usePomodoroStore((state) => state.pomodoro);
  const setActive = usePomodoroStore((state) => state.setActive);
  const setDefaultPomodoro = usePomodoroStore(
    (state) => state.setDefaultPomodoro,
  );

  const audioRef = useRef<HTMLAudioElement>(null);

  const [completeTime, setCompleteTime] = useState(false);

  const formatTime = useMemo(() => {
    return (seconds: number): string => {
      const minutes = Math.floor(seconds / 60);
      const restSeconds = seconds % 60;

      const formatedMinutes = String(minutes).padStart(2, "0");
      const formatedSeconds = String(restSeconds).padStart(2, "0");

      return `${formatedMinutes}:${formatedSeconds}`;
    };
  }, []);

  const handleStop = useMemo(() => {
    console.log("asd");
    return () => {
      setActive(!pomodoro.isActive);
    };
  }, [pomodoro.isActive]);

  const { audios, audioName } = useMemo(() => {
    const audios = {
      bell: bellSound,
      nooo: noooSound,
    };
    const audioName = user?.settings.alarm as keyof typeof audios;
    return {
      audios,
      audioName,
    };
  }, []);

  useEffect(() => {
    document.title = "PomoMon";

    const playSound = () => {
      if (!user || !audioRef.current) return;
      const volume = Number(user.settings.volume);
      audioRef.current.volume = volume;
      audioRef.current.play();
    };

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

    if (completeTime) {
      changeMode();
      playSound();
    }

    let timeLeft = pomodoro.timeLeft || 0;
    const mode = pomodoro.mode;
    const interval = setInterval(() => {
      timeLeft -= 1;
      if (timeLeft <= 0) {
        setCompleteTime(true);
        return;
      }
      if (pomodoro.isActive) {
        setTime();
        document.title = `${formatTime(timeLeft)} (${
          mode[0].toUpperCase() + mode.slice(1)
        }) - PomoMon`;
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [completeTime, pomodoro.isActive]);

  return (
    <>
      <p
        onClick={handleStop}
        className={`${
          pomodoro.isActive ? "text-red-500" : "text-red-400"
        } text-8xl md:text-9xl font-extrabold cursor-pointer w-fit mx-auto`}
      >
        {formatTime(pomodoro.timeLeft)}
      </p>

      <audio ref={audioRef} src={audios[audioName]}></audio>
    </>
  );
}
