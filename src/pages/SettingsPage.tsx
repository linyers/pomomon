import { useEffect, useRef, useState } from "react";
import { useUserStore } from "../store/user";
import { usePomodoroStore } from "../store/pomodoro";

import bellSound from "../assets/bell.mp3";
import noooSound from "../assets/nooo.mp3";

import "../App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeHigh, faVolumeOff } from "@fortawesome/free-solid-svg-icons";

export default function SettingsPage() {
  const deleteUser = useUserStore((state) => state.deleteUser);
  const setDefaultUser = useUserStore((state) => state.setDefaultUser);
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const setDefaultPomodoro = usePomodoroStore(
    (state) => state.setDefaultPomodoro,
  );
  const [errors, setErrors] = useState<string[]>([]);
  const [reset, setReset] = useState<boolean>(false);

  const [volumeRange, setVolumeRange] = useState(
    user ? user.settings.volume * 100 : 50,
  );

  const formRef = useRef<HTMLFormElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (reset) {
      setErrors([]);
      setReset(false);
    }
  }, [reset]);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (errors.length > 0) return;

    const data = new FormData(e.currentTarget);
    const name = data.get("name") as string;
    const work = Number(data.get("work"));
    const breakTime = Number(data.get("break"));
    const longBreak = Number(data.get("longBreak"));
    const alarm = data.get("alarm") as string;
    const volume = Number(data.get("volume")) * 0.01;

    setUser(name, work, breakTime, longBreak, alarm, volume);
    setDefaultPomodoro(work);
  };

  const handleDeleteUser = () => {
    deleteUser();
  };

  const handleDefaultSettings = () => {
    if (!user) return;
    setDefaultUser(user.name);
    const defaultWorkTime = 25;
    const defaultBreakTime = 5;
    const defaultLongBreakTime = 10;
    const defaultAlarm = "bell";
    const defaultVolume = 50;
    setDefaultPomodoro(defaultWorkTime);
    setReset(!reset);

    if (!formRef.current) return;

    formRef.current.work.value = defaultWorkTime;
    formRef.current.break.value = defaultBreakTime;
    formRef.current.longBreak.value = defaultLongBreakTime;
    formRef.current.alarm.value = defaultAlarm;
    formRef.current.volume.value = defaultVolume;

    setVolumeRange(defaultVolume);
  };

  const disableWheel = (e: React.WheelEvent<HTMLInputElement>) => {
    e.currentTarget.blur();
  };

  const playAudio = () => {
    if (!formRef.current || !audioRef.current) return;

    const audios = {
      bell: bellSound,
      nooo: noooSound,
    };

    const audioName = formRef.current.alarm.value as keyof typeof audios;
    const audioSrc = audios[audioName];
    audioRef.current.src = audioSrc;
    const volume = Number(formRef.current.volume.value) * 0.01;
    audioRef.current.volume = volume;
    audioRef.current.play();
  };

  const audios = ["bell", "nooo"];

  return (
    <main className="text-red-400 grid gap-10 mt-14 bg-red-200 border-4 border-red-300 p-5 rounded-3xl md:w-2/3 m-auto">
      <h1 className="text-3xl font-bold">Settings</h1>
      <form className="grid gap-2" ref={formRef} onSubmit={handleSubmit}>
        <label className="flex self-end px-2">Name:</label>
        <input
          className="bg-red-100 p-2 border-2 border-red-300 rounded-xl text-lg outline-red-400"
          defaultValue={user?.name}
          name="name"
          placeholder="Username"
          type="text"
          onChange={(e) =>
            !e.target.value
              ? setErrors([...errors, "name"])
              : setErrors(errors.filter((error) => error !== "name"))
          }
        />
        <div className="pt-2 grid grid-cols-3 gap-2">
          <label className="flex self-end px-2">Work time:</label>
          <label className="flex self-end px-2">Break time:</label>
          <label className="flex self-end px-2">Long break time:</label>
          <input
            className="p-2 border-2 border-red-300 rounded-xl text-lg bg-red-100 outline-red-400"
            defaultValue={user?.settings.work}
            name="work"
            placeholder="Work time"
            type="number"
            onChange={(e) =>
              !e.target.value || e.target.value === "0"
                ? setErrors([...errors, "work"])
                : setErrors(errors.filter((error) => error !== "work"))
            }
            onWheel={disableWheel}
          />
          <input
            className="p-2 border-2 border-red-300 rounded-xl text-lg bg-red-100 outline-red-400"
            defaultValue={user?.settings.break}
            name="break"
            placeholder="Break time"
            type="number"
            onChange={(e) =>
              !e.target.value || e.target.value === "0"
                ? setErrors([...errors, "break"])
                : setErrors(errors.filter((error) => error !== "break"))
            }
            onWheel={disableWheel}
          />
          <input
            className="p-2 border-2 border-red-300 rounded-xl text-lg bg-red-100 outline-red-400"
            defaultValue={user?.settings.longBreak}
            name="longBreak"
            placeholder="Long break time"
            type="number"
            onChange={(e) =>
              !e.target.value || e.target.value === "0"
                ? setErrors([...errors, "longBreak"])
                : setErrors(errors.filter((error) => error !== "longBreak"))
            }
            onWheel={disableWheel}
          />
        </div>

        <label className="pt-2 flex self-end px-2">Alarm sound:</label>

        <div className="gap-2 grid grid-cols-2">
          <select
            className="p-2 border-2 border-red-300 rounded-xl text-lg bg-red-100 outline-red-400"
            name="alarm"
            id=""
            defaultValue={user?.settings.alarm}
          >
            {audios.map((audio, idx) => {
              return (
                <option key={idx} value={audio} className="capitalize">
                  {audio}
                </option>
              );
            })}
          </select>
          <button
            className="font-bold p-2 rounded-xl text-lg bg-red-300 border-2 border-red-300 hover:bg-red-300/70 duration-150"
            type="button"
            onClick={playAudio}
          >
            Play
          </button>
        </div>
        <audio ref={audioRef} src=""></audio>

        <div className="flex items-center justify-center gap-5">
          <span className="text-red-400">
            <FontAwesomeIcon
              icon={volumeRange > 0 ? faVolumeHigh : faVolumeOff}
            />
          </span>
          <label className="w-2/3 md:w-1/2 slider">
            <input
              type="range"
              className="level my-6 outline-none"
              defaultValue={user ? user.settings.volume * 100 : 50}
              name="volume"
              placeholder="Volume"
              min={0}
              max={100}
              onChange={(e) => setVolumeRange(Number(e.target.value))}
            />
          </label>
          <span className="text-red-400 font-bold">{volumeRange}</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            className="p-2 border-2 border-red-300 rounded-xl text-lg bg-red-300 hover:bg-red-300/70 font-bold duration-150"
            type="button"
            onClick={handleDeleteUser}
          >
            Delete user
          </button>
          <button
            className="p-2 border-2 border-red-300 rounded-xl text-lg bg-red-200 hover:bg-red-300 font-bold duration-150"
            type="submit"
          >
            Save changes
          </button>
          <button
            className="p-2 border-2 border-red-300 rounded-xl text-lg bg-red-200 hover:bg-red-300 font-bold duration-150"
            type="button"
            onClick={handleDefaultSettings}
          >
            Default settings
          </button>
        </div>
      </form>
    </main>
  );
}
