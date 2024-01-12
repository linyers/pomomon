import { Link } from "react-router-dom";
import { useUserStore } from "../store/user";

export default function () {
  const user = useUserStore((state) => state.user);
  return (
    <>
      <h1>Pomomon</h1>
      <p>Hi {user?.name}! Ready to work?</p>
      <Link to="/timer">Start Pomodoro</Link>
    </>
  );
}
