import { Link } from "react-router-dom";
import { useUserStore } from "../store/user";

export default function () {
  const user = useUserStore((state) => state.user);
  return (
    <main className="text-red-400 grid gap-10 mt-14">
      <h1 className="text-6xl font-bold">PomoMon</h1>
      <p className="text-xl">
        Hi <b>{user?.name}!</b> Ready to work?
      </p>
      <Link
        className="bg-red-200 w-fit m-auto p-4 rounded-xl font-bold text-lg hover:bg-red-300 duration-150"
        to="/timer"
      >
        Start Pomodoro
      </Link>
    </main>
  );
}
