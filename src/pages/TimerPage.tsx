import { usePomodoroStore } from "../store/pomodoro";
import { useUserStore } from "../store/user";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRotateLeft,
  faPause,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import Timer from "../components/Timer";

export default function () {
  const user = useUserStore((state) => state.user);
  const pomodoro = usePomodoroStore((state) => state.pomodoro);
  const setActive = usePomodoroStore((state) => state.setActive);
  const setDefaultPomodoro = usePomodoroStore(
    (state) => state.setDefaultPomodoro,
  );

  const handleStop = () => {
    setActive(!pomodoro.isActive);
  };

  const handleReset = () => {
    if (!user) return;
    setDefaultPomodoro(user.settings.work);
  };

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
      <Timer />
      <input
        className="m-auto bg-red-100 p-2 border-4 border-red-300 rounded-xl text-lg outline-red-400 text-center placeholder-red-300 font-semibold"
        type="text"
        name="task"
        placeholder="Write a task"
        id=""
      />
      <div className="flex items-center justify-center gap-5 text-xl capitalize">
        <p>
          Mode: <b>{pomodoro.mode}</b>
        </p>
        <p>
          Round: <b>{pomodoro.round}</b>
        </p>
      </div>
    </main>
  );
}
