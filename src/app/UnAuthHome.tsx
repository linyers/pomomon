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
    <main className="grid gap-10 mt-14">
      <h1 className="text-6xl font-bold">Pomomon</h1>
      <p className="text-2xl">
        Unlock productivity with Pomomon – your companion for focused goals.
      </p>
      <div className="text-lg mt-5">
        <p>Create your account below</p>
        <p>Your account will be saved locally on your device.</p>
        <form className="grid py-10 w-fit m-auto" onSubmit={handleSubmit}>
          <input
            className="p-2 border-2 rounded-xl"
            type="text"
            name="name"
            placeholder="Your username..."
          />
          <button className="mt-2 bg-red-200 w-fit m-auto p-3 rounded-xl font-bold text-lg">
            Enter to Pomomon
          </button>
        </form>
      </div>
    </main>
  );
}
