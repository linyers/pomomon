import { useUserStore } from "../store/user";
import { usePomodoroStore } from "../store/pomodoro";

export default function UnAuthHome() {
  window.history.pushState({}, "", "/");

  const setDefaultUser = useUserStore((state) => state.setDefaultUser);
  const setDefaultPomodoro = usePomodoroStore(
    (state) => state.setDefaultPomodoro,
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = data.get("name") as string;
    if (!name) return;
    setDefaultUser(name);
    const defaultWorkTime = 25;
    setDefaultPomodoro(defaultWorkTime);
  };

  return (
    <main>
      <h1>Pomomon</h1>
      <p>
        Unlock productivity with Pomomon – your companion for focused goals.
      </p>
      <div>
        <p>
          Create your account below; your account will be saved locally on your
          device.
        </p>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Your username..." />
          <button>Enter to Pomomon</button>
        </form>
      </div>
    </main>
  );
}
