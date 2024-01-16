import { useEffect, useRef, useState } from "react";
import { useUserStore } from "../store/user";
import { usePomodoroStore } from "../store/pomodoro";

import bellSound from "../assets/bell.mp3";
import noooSound from "../assets/nooo.mp3";

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

  const formRef = useRef(null);
  const audioRef = useRef(null);

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
    const volume = Number(data.get("volume"));

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
    const defaultVolume = 0.5;
    setDefaultPomodoro(defaultWorkTime);
    setReset(!reset);

    if (!formRef.current) return;
    formRef.current.work.value = defaultWorkTime;
    formRef.current.break.value = defaultBreakTime;
    formRef.current.longBreak.value = defaultLongBreakTime;
    formRef.current.alarm.value = defaultAlarm;
    formRef.current.volume.value = defaultVolume;
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

    const audioName = formRef.current.alarm.value;
    audioRef.current.src = audios[audioName] || audios.bell;
    const volume = Number(formRef.current.volume.value);
    audioRef.current.volume = volume;
    audioRef.current.play();
  };

  const audios = ["bell", "nooo"];

  return (
    <>
      <h1>Settings</h1>
      <form ref={formRef} onSubmit={handleSubmit}>
        <input
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
        <input
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

        <select name="alarm" id="">
          {audios.map((audio, idx) => {
            return (
              <option
                selected={user?.settings.alarm === audio}
                key={idx}
                value={audio}
                className="capitalize"
              >
                {audio}
              </option>
            );
          })}
        </select>
        <button type="button" onClick={playAudio}>
          Play
        </button>
        <audio ref={audioRef} src=""></audio>
        <input
          defaultValue={user?.settings.volume}
          name="volume"
          placeholder="Volume"
          type="number"
          onWheel={disableWheel}
        />
        <button type="button" onClick={handleDeleteUser}>
          Delete user
        </button>
        <button type="submit">Save changes</button>
        <button type="button" onClick={handleDefaultSettings}>
          Default settings
        </button>
      </form>
    </>
  );
}
