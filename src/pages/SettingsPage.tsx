import { useEffect, useState } from "react";
import { useUserStore } from "../store/user";
import { usePomodoroStore } from "../store/pomodoro";

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
    setDefaultPomodoro(defaultWorkTime);
    setReset(!reset);
  };

  const disableWheel = (e: React.WheelEvent<HTMLInputElement>) => {
    e.currentTarget.blur();
  };

  return (
    <>
      <h1>Settings</h1>
      <form onSubmit={handleSubmit}>
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
        <input
          defaultValue={user?.settings.alarm}
          name="alarm"
          placeholder="Alarm"
          type="text"
        />
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
