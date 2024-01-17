import { useEffect, useRef, useState } from "react";
import { usePomodoroStore } from "../store/pomodoro";
import { PomodoroMode } from "../enums";
import { useUserStore } from "../store/user";

import bellSound from "../assets/bell.mp3";
import noooSound from "../assets/nooo.mp3";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRotateLeft,
  faPause,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";

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

  const audioRef = useRef<HTMLAudioElement>(null);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const restSeconds = seconds % 60;

    const formatedMinutes = String(minutes).padStart(2, "0");
    const formatedSeconds = String(restSeconds).padStart(2, "0");

    return `${formatedMinutes}:${formatedSeconds}`;
  };

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

  const handleStop = () => {
    setActive(!pomodoro.isActive);
  };

  const handleReset = () => {
    if (!user) return;
    setDefaultPomodoro(user.settings.work);
  };

  const audios = {
    bell: bellSound,
    nooo: noooSound,
  };

  const audioName = user?.settings.alarm as keyof typeof audios;

  return (
    <main className="text-red-400 grid gap-10 mt-14">
      <h1 className="text-6xl font-bold mb-5">PomoMon</h1>
      <div className="flex items-center justify-center gap-10 text-5xl">
        <button className="outline-none" onClick={handleStop}>
          {pomodoro.isActive ? (
            <FontAwesomeIcon icon={faPause} />
          ) : (
            <FontAwesomeIcon icon={faPlay} />
          )}
        </button>
        <button className="outline-none" onClick={handleReset}>
          <FontAwesomeIcon icon={faArrowRotateLeft} />
        </button>
      </div>
      <p
        className={`${
          pomodoro.isActive ? "text-red-500" : "text-red-400"
        } text-8xl md:text-9xl font-extrabold`}
      >
        {formatTime(pomodoro.timeLeft)}
      </p>
      <div className="flex items-center justify-center gap-5 text-xl capitalize">
        <p>
          Mode: <b>{pomodoro.mode}</b>
        </p>
        <p>
          Round: <b>{pomodoro.round}</b>
        </p>
      </div>
      <audio ref={audioRef} src={audios[audioName]}></audio>
    </main>
  );
}
