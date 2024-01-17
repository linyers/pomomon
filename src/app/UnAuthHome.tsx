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
    <main className="text-red-400 grid gap-10 mt-14">
      <h1 className="text-6xl font-bold">PomoMon</h1>
      <p className="text-2xl">
        Unlock productivity with Pomomon – your companion for focused goals.
      </p>
      <div className="text-lg mt-5">
        <p>Create your account below</p>
        <p>Your account will be saved locally on your device.</p>
        <form className="grid py-10 w-fit m-auto" onSubmit={handleSubmit}>
          <input
            className="p-2 border-2 border-red-300 rounded-xl text-lg bg-red-100 outline-red-400"
            type="text"
            name="name"
            placeholder="Your username..."
          />
          <button className="mt-2 p-2 border-2 border-red-300 rounded-xl text-lg bg-red-300 hover:bg-red-300/70 font-bold duration-150">
            Enter to Pomomon
          </button>
        </form>
      </div>
    </main>
  );
}
