import "./App.css";
import AuthHome from "./app/AuthHome";
import UnAuthHome from "./app/UnAuthHome";
import { useUserStore } from "./store/user";

function App() {
  const user = useUserStore((state) => state.user);
  return <>{user ? <AuthHome /> : <UnAuthHome />}</>;
}

export default App;
